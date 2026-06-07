import opentype from 'opentype.js';
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const RED = '#E8432A', CREAM = '#F2E6CE', INK = '#1A1714';
const SWELL = 'M0 72 C 24 58, 40 58, 52 65 C 64 72, 82 72, 100 62';
const _buf = readFileSync(resolve(here, 'fonts/BebasNeue-Regular.ttf'));
const font = opentype.parse(_buf.buffer.slice(_buf.byteOffset, _buf.byteOffset + _buf.byteLength));

// --- G, centred in a 0..100 box, 7° tilt ---
const gPathObj = font.getPath('G', 0, 0, 92);
const gb = gPathObj.getBoundingBox();
const gcx = (gb.x1 + gb.x2) / 2, gcy = (gb.y1 + gb.y2) / 2;
const gMark = (fill = CREAM) =>
  `<path transform="rotate(7 50 50) translate(${(50 - gcx).toFixed(2)} ${(50 - gcy).toFixed(2)})" d="${gPathObj.toPathData(2)}" fill="${fill}"/>`;

// tile = red rounded square + swell + G, all in a 0..100 box
const tile = `<rect width="100" height="100" rx="22" fill="${RED}"/>` +
  `<path d="${SWELL}" fill="none" stroke="${CREAM}" stroke-width="6" stroke-linecap="round"/>` +
  gMark(CREAM);

// favicon.svg
writeFileSync(resolve(root, 'apps/web/public/favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${tile}</svg>`);

// --- GLIDR wordmark outlined ---
const wObj = font.getPath('GLIDR', 0, 0, 76);
const wb = wObj.getBoundingBox();
const wW = Math.ceil(wb.x2 - wb.x1), wH = Math.ceil(wb.y2 - wb.y1);
const word = (fill) =>
  `<path transform="translate(${(-wb.x1).toFixed(2)} ${(-wb.y1).toFixed(2)})" d="${wObj.toPathData(2)}" fill="${fill}"/>`;

// glidr-logo.svg (ink wordmark for cream-bg nav)
writeFileSync(resolve(root, 'apps/web/public/glidr-logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${wW} ${wH}">${word(INK)}</svg>`);

// glidr-lockup.svg: tile (left, 90px) + ink wordmark (right, vertically centred in 100)
const gap = 24;
const wordY = (100 - wH) / 2;
const lockW = 90 + gap + wW;
writeFileSync(resolve(root, 'apps/web/public/glidr-lockup.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(lockW)} 100">` +
  `<g transform="translate(0 5) scale(0.9)">${tile}</g>` +
  `<g transform="translate(${90 + gap} ${wordY.toFixed(2)})">${word(INK)}</g>` +
  `</svg>`);

console.log('wrote favicon.svg, glidr-logo.svg, glidr-lockup.svg');
