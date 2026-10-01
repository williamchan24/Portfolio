<?php
// Copy this file to config.php (same folder) and fill it in.
// This folder sits NEXT TO public_html on the server, so nobody can open it in a browser.
return [
    // Where contact form messages get emailed (also saved to storage/messages.log as a backup)
    'notify_email' => '',                                 // e.g. 'you@gmail.com'
    'mail_from'    => 'no-reply@williamchanwinghong.com', // should be an address on your domain
    'max_per_hour' => 3,                                  // messages allowed per visitor per hour
];
