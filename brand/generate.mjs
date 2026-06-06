import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { markSVG, adaptiveForegroundSVG, wordmarkSVG, ogSVG } from './svg.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const FONT = resolve(here, 'fonts/BebasNeue-Regular.ttf');
const fontOpt = { fontFiles: [FONT], loadSystemFonts: false, defaultFontFamily: 'Bebas Neue' };

function png(svg, width) {
  return new Resvg(svg, { font: fontOpt, fitTo: { mode: 'width', value: width } }).render().asPng();
}
const out = (rel, buf) => {
  const p = resolve(root, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, buf);
  console.log('wrote', rel);
};

// Mobile
out('apps/mobile/assets/icon.png', png(markSVG(), 1024));
out('apps/mobile/assets/adaptive-icon.png', png(adaptiveForegroundSVG(), 1024));
out('apps/mobile/assets/splash-wordmark.png', png(wordmarkSVG(), 1200));

// Web
out('apps/web/public/og.png', png(ogSVG(), 1200));
out('apps/web/public/apple-touch-icon.png', png(markSVG(), 180));
await sharp(png(markSVG(), 32)).toFile(resolve(root, 'apps/web/public/favicon-32.png'));
console.log('wrote apps/web/public/favicon-32.png');
