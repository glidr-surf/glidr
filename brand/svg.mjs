export const RED = '#E8432A';
export const CREAM = '#F2E6CE';
export const INK = '#1A1714';
const SWELL = 'M0 72 C 24 58, 40 58, 52 65 C 64 72, 82 72, 100 62';

// Square icon, full-bleed red. G centred + 7° tilt + low swell. viewBox 0 0 100 100.
export function markSVG({ bg = RED, fg = CREAM } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    ${bg ? `<rect width="100" height="100" fill="${bg}"/>` : ''}
    <path d="${SWELL}" fill="none" stroke="${fg}" stroke-width="6" stroke-linecap="round"/>
    <text x="50" y="76" text-anchor="middle" font-family="Bebas Neue" font-size="92" fill="${fg}" transform="rotate(7 50 50)">G</text>
  </svg>`;
}

// Android adaptive foreground: G+swell inside the central ~62% safe zone, transparent bg.
export function adaptiveForegroundSVG({ fg = CREAM } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <g transform="translate(50 50) scale(0.62) translate(-50 -50)">
      <path d="${SWELL}" fill="none" stroke="${fg}" stroke-width="6" stroke-linecap="round"/>
      <text x="50" y="76" text-anchor="middle" font-family="Bebas Neue" font-size="92" fill="${fg}" transform="rotate(7 50 50)">G</text>
    </g>
  </svg>`;
}

export function wordmarkSVG({ color = CREAM } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 90">
    <text x="170" y="68" text-anchor="middle" font-family="Bebas Neue" font-size="76" letter-spacing="6" fill="${color}">GLIDR</text>
  </svg>`;
}

export function ogSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="${RED}"/>
    <path d="M0 470 C 300 400, 520 400, 660 445 C 820 495, 980 495, 1200 415" fill="none" stroke="${CREAM}" stroke-opacity="0.22" stroke-width="14" stroke-linecap="round"/>
    <text x="600" y="330" text-anchor="middle" font-family="Bebas Neue" font-size="190" letter-spacing="14" fill="${CREAM}">GLIDR</text>
    <text x="600" y="400" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="34" fill="${CREAM}" fill-opacity="0.92">It's the board, silly</text>
  </svg>`;
}
