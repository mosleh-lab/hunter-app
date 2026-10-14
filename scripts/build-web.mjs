// Copies the web app into www/ for the native iOS build (the GitHub Pages site serves the repo root directly).
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const p of ['index.html', 'manifest.webmanifest', 'sw.js', 'js', 'data', 'vendor', 'icons']) cpSync(p, `www/${p}`, { recursive: true });
// Stamp the build with its commit so the app can tell when a newer build is published.
let sha = '';
try { sha = execSync('git rev-parse --short HEAD').toString().trim(); } catch {}
const html = readFileSync('www/index.html', 'utf8').replace('<head>', `<head>\n<script>window.ARISE_BUILD = ${JSON.stringify(sha)};</script>`);
writeFileSync('www/index.html', html);
console.log('www/ ready', sha);
