<?php
// Copy this file to config.php (same folder) and fill it in. config.php is gitignored,
// and `npm run push` uploads it to the server's private/ folder for you.
// This folder sits NEXT TO public_html on the server, so nobody can open it in a browser.
return [
    // Resend API key — create one at https://resend.com/api-keys ("Sending access" is enough)
    'resend_api_key' => '',                               // starts with 're_'
    // Where contact form messages get emailed (also saved to storage/messages.log as a backup).
    // Until your domain is verified in Resend, this must be the email you signed up to Resend with.
    'notify_email'   => '',                               // e.g. 'you@gmail.com'
    // Sender. 'onboarding@resend.dev' works straight away; once williamchanwinghong.com is
    // verified in Resend (Domains → Add domain), switch to an address on it.
    'mail_from'      => 'Portfolio <onboarding@resend.dev>', // later: 'Portfolio <hello@williamchanwinghong.com>'
    'max_per_hour'   => 3,                                // messages allowed per visitor per hour
];
