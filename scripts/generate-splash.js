const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SPLASH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="sbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f0a24"/>
      <stop offset="50%" style="stop-color:#1a1040"/>
      <stop offset="100%" style="stop-color:#2d1b69"/>
    </linearGradient>
    <linearGradient id="sgold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#f59e0b"/>
    </linearGradient>
    <linearGradient id="sglow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
    <filter id="sglowFilter">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#sbg)"/>
  <circle cx="512" cy="340" r="140" fill="none" stroke="url(#sgold)" stroke-width="10" filter="url(#sglowFilter)"/>
  <circle cx="512" cy="340" r="100" fill="none" stroke="#7c3aed" stroke-width="5" opacity="0.5"/>
  <circle cx="512" cy="340" r="60" fill="none" stroke="url(#sgold)" stroke-width="3" opacity="0.3"/>
  <circle cx="512" cy="340" r="25" fill="url(#sgold)" filter="url(#sglowFilter)"/>
  <line x1="652" y1="200" x2="750" y2="102" stroke="url(#sgold)" stroke-width="12" stroke-linecap="round" filter="url(#sglowFilter)"/>
  <rect x="710" y="50" width="90" height="90" rx="14" fill="none" stroke="url(#sgold)" stroke-width="10" transform="rotate(45, 755, 95)" filter="url(#sglowFilter)"/>
  <text x="512" y="580" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="120" font-weight="900" fill="url(#sgold)" filter="url(#sglowFilter)" letter-spacing="8">BLUFFIX</text>
  <text x="512" y="640" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="36" fill="#a78bfa" letter-spacing="14">IMPOSTOR GAME</text>
  <path d="M200 750 Q512 820 824 750" fill="none" stroke="url(#sglow)" stroke-width="3" opacity="0.3"/>
</svg>`;

const RES_DIR = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');

const SPLASH_SIZES = [
  { dir: 'drawable', size: 1024 },
  { dir: 'drawable-port-mdpi', size: 320 },
  { dir: 'drawable-port-hdpi', size: 480 },
  { dir: 'drawable-port-xhdpi', size: 640 },
  { dir: 'drawable-port-xxhdpi', size: 800 },
  { dir: 'drawable-port-xxxhdpi', size: 960 },
  { dir: 'drawable-land-mdpi', size: 320 },
  { dir: 'drawable-land-hdpi', size: 480 },
  { dir: 'drawable-land-xhdpi', size: 640 },
  { dir: 'drawable-land-xxhdpi', size: 800 },
  { dir: 'drawable-land-xxxhdpi', size: 960 },
];

async function generate() {
  console.log('Generating splash screens...');
  const svgBuf = Buffer.from(SPLASH_SVG);

  for (const { dir, size } of SPLASH_SIZES) {
    const splashDir = path.join(RES_DIR, dir);
    fs.mkdirSync(splashDir, { recursive: true });
    await sharp(svgBuf)
      .resize(size, size)
      .png()
      .toFile(path.join(splashDir, 'splash.png'));
    console.log(`  ${dir}: ${size}x${size} OK`);
  }

  console.log('All splash screens generated!');
}

generate().catch(e => { console.error(e); process.exit(1); });
