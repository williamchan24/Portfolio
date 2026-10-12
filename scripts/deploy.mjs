// Wipes FTP_DIR on the server, then uploads everything inside dist/ (explicit FTPS).
// Settings come from .env (never committed) — see .env.example.
import { Client } from 'basic-ftp';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const { FTP_HOST, FTP_USER, FTP_PASSWORD, FTP_DIR = '/www' } = process.env;
const ROOT = FTP_DIR.replace(/\/+$/, '');
const MAX_TRIES = 5;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('Missing FTP_HOST, FTP_USER or FTP_PASSWORD. Copy .env.example to .env and fill it in.');
  process.exit(1);
}
if (!existsSync('dist')) {
  console.error('No dist/ folder found. Run the build first.');
  process.exit(1);
}
if (ROOT === '') {
  console.error('Refusing to wipe the server root. Set FTP_DIR.');
  process.exit(1);
}

let client = new Client();

async function connect() {
  client.close();
  client = new Client();
  await client.access({
    host: FTP_HOST,
    user: FTP_USER,
    password: FTP_PASSWORD,
    secure: true, // explicit SSL (AUTH TLS on port 21)
    // The server uses a self-signed certificate, so skip the CA check (still encrypted).
    secureOptions: { rejectUnauthorized: process.env.FTP_ALLOW_SELF_SIGNED !== 'true' },
  });
}

// The server sometimes refuses data connections when they come too fast
// ("425 Cannot prepare for data connection"). On any error, wait, reconnect and try again.
async function withRetry(label, fn) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= MAX_TRIES) throw new Error(`${label}: ${err.message}`);
      const wait = attempt * 3;
      console.log(`  ! ${label} failed (${err.message}) — retrying in ${wait}s (${attempt}/${MAX_TRIES - 1})`);
      await sleep(wait * 1000);
      await connect().catch(() => {}); // if this fails, the next attempt will fail and retry again
    }
  }
}

// Uploads localDir to remoteDir (absolute paths, so a reconnect can't lose our place).
async function uploadDir(localDir, remoteDir) {
  await withRetry(`create ${remoteDir}`, () => client.ensureDir(remoteDir));
  for (const entry of readdirSync(localDir, { withFileTypes: true })) {
    const localPath = join(localDir, entry.name);
    const remotePath = `${remoteDir}/${entry.name}`;
    if (entry.isDirectory()) {
      await uploadDir(localPath, remotePath);
    } else {
      await withRetry(`upload ${remotePath}`, () => client.uploadFrom(localPath, remotePath));
      console.log(`  ${remotePath.slice(ROOT.length)}`);
    }
  }
}

try {
  await withRetry('connect', connect);
  console.log(`Connected to ${FTP_HOST}.`);
  console.log(`Deleting everything in ${ROOT} ...`);
  await withRetry(`clear ${ROOT}`, async () => {
    await client.ensureDir(ROOT); // also changes into it
    await client.clearWorkingDir();
  });
  console.log(`Uploading dist/ to ${ROOT} ...`);
  await uploadDir('dist', ROOT);
  console.log('Done.');
} catch (err) {
  console.error('Upload failed:', err.message);
  process.exitCode = 1;
} finally {
  client.close();
}
