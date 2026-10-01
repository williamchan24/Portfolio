<?php
/**
 * Contact form handler — the only server-side code on the site.
 *
 * Files in Astro's public/ folder are copied as-is into dist/, so this ends up at
 * public_html/contact.php on the server. Private settings + saved messages live in
 * ../private/ (next to public_html, so they can't be opened in a browser).
 *
 * Responds with JSON when called by the page's JavaScript, or redirects to
 * /message-sent/ or /message-error/ when JS is off.
 */
declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

$privateDir = dirname(__DIR__) . '/private';
$config = array_merge(
    ['notify_email' => '', 'mail_from' => '', 'max_per_hour' => 3],
    is_file($privateDir . '/config.php') ? (array) require $privateDir . '/config.php' : []
);
$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, bool $json, array $errors = []): never
{
    if ($json) {
        http_response_code($ok ? 200 : 422);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'ok'      => $ok,
            'message' => $ok ? "Thanks! Your message has been sent — I'll get back to you soon." : null,
            'errors'  => $errors,
        ]);
    } else {
        header('Location: ' . ($ok ? '/message-sent/' : '/message-error/'), true, 303);
    }
    exit;
}

// Only accept POSTs
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    header('Location: /#contact', true, 303);
    exit;
}

// Only accept submissions coming from this site (basic cross-site protection)
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== parse_url('//' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) {
    respond(false, $wantsJson, ['form' => 'Invalid request.']);
}

// Honeypot filled → bot. Pretend it worked so it doesn't retry.
if (!empty($_POST['website'])) {
    respond(true, $wantsJson);
}

$name  = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$body  = trim((string) ($_POST['body'] ?? ''));

$errors = [];
if ($name === '' || mb_strlen($name) > 100) {
    $errors['name'] = 'Please enter your name.';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    $errors['email'] = 'Please enter a valid email address.';
}
if (mb_strlen($body) < 10 || mb_strlen($body) > 5000) {
    $errors['body'] = 'Message should be between 10 and 5,000 characters.';
}
if ($errors) {
    respond(false, $wantsJson, $errors);
}

// ---- Rate limit: max N messages per visitor per hour ----
$storage = $privateDir . '/storage';
if (!is_dir($storage)) {
    @mkdir($storage, 0750, true);
}
$fh = @fopen($storage . '/ratelimit.json', 'c+');
if ($fh) {
    flock($fh, LOCK_EX);
    $data = json_decode((string) stream_get_contents($fh), true) ?: [];
    $now  = time();
    $key  = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? ''); // don't store raw IPs
    foreach ($data as $k => $times) {
        $data[$k] = array_values(array_filter($times, fn ($t) => $t > $now - 3600));
        if (!$data[$k]) {
            unset($data[$k]);
        }
    }
    $limited = count($data[$key] ?? []) >= (int) $config['max_per_hour'];
    if (!$limited) {
        $data[$key][] = $now;
    }
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($data));
    flock($fh, LOCK_UN);
    fclose($fh);

    if ($limited) {
        respond(false, $wantsJson, ['form' => "You've sent a few messages already — please try again later or email me directly."]);
    }
}

// ---- Save a backup copy (in case email doesn't arrive) ----
@file_put_contents(
    $storage . '/messages.log',
    json_encode(['at' => date('c'), 'name' => $name, 'email' => $email, 'body' => $body], JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

// ---- Email it to you ----
if ($config['notify_email'] !== '') {
    $safeName = preg_replace('/[\r\n]+/', ' ', $name);
    $from     = $config['mail_from'] ?: 'no-reply@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
    @mail(
        $config['notify_email'],
        'New message from ' . $safeName,
        "From: {$safeName} <{$email}>\n\n{$body}",
        [
            'From'         => $from,
            'Reply-To'     => $email, // already validated, so no header injection
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]
    );
}

respond(true, $wantsJson);
