// Wipes FTP_DIR on the server, then uploads everything inside dist/ (explicit FTPS).
// Settings come from .env (never committed) — see .env.example.
import { Client } from 'basic-ftp';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIR = '/www' } = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('Missing FTP_HOST, FTP_USER or FTP_PASSWORD. Copy .env.example to .env and fill it in.');
  process.exit(1);
}
if (!existsSync('dist')) {
  console.error('No dist/ folder found. Run the build first.');
  process.exit(1);
}

// Uploads localDir into the server's current folder, printing each file once.
async function uploadDir(client, localDir, remotePath = '') {
  for (const entry of readdirSync(localDir, { withFileTypes: true })) {
    const localPath = join(localDir, entry.name);
    const shown = `${remotePath}/${entry.name}`;
    if (entry.isDirectory()) {
      await client.ensureDir(entry.name); // creates it and changes into it
      await uploadDir(client, localPath, shown);
      await client.cdup();
    } else {
      await client.uploadFrom(localPath, entry.name);
      console.log(`  ${shown}`);
    }
  }
}

const client = new Client();
try {
  if (FTP_DIR.replace(/\/+$/, '') === '') throw new Error('Refusing to wipe the server root. Set FTP_DIR.');
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    secure: true, // explicit SSL (AUTH TLS on port 21)
    // The server uses a self-signed certificate, so skip the CA check (still encrypted).
    secureOptions: { rejectUnauthorized: process.env.FTP_ALLOW_SELF_SIGNED !== 'true' },
  });
  console.log(`Connected to ${FTP_HOST}.`);
  await client.ensureDir(FTP_DIR); // also changes into it
  console.log(`Deleting everything in ${FTP_DIR} ...`);
  await client.clearWorkingDir();
  console.log(`Uploading dist/ to ${FTP_DIR} ...`);
  await uploadDir(client, 'dist');
  console.log('Done.');
} catch (err) {
  console.error('Upload failed:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
