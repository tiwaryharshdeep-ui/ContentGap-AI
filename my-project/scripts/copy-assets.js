import fs from 'fs';
import path from 'path';

const distFrontend = path.resolve(process.cwd(), 'dist/frontend');
const srcFrontendHtml = path.resolve(process.cwd(), 'src/frontend/index.html');
const distFrontendHtml = path.resolve(distFrontend, 'index.html');

fs.mkdirSync(distFrontend, { recursive: true });
fs.copyFileSync(srcFrontendHtml, distFrontendHtml);
console.log('✅ Successfully copied frontend assets to dist/frontend');
