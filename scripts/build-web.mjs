// Copies the web app into www/ for the native iOS build (the GitHub Pages site serves the repo root directly).
import { cpSync, rmSync, mkdirSync } from 'node:fs';
rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const p of ['index.html', 'manifest.webmanifest', 'sw.js', 'js', 'data', 'vendor', 'icons']) cpSync(p, `www/${p}`, { recursive: true });
console.log('www/ ready');
