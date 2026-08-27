const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SVG_LOGO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1040"/>
      <stop offset="100%" style="stop-color:#2d1b69"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#f59e0b"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.5"/>
    </filter>
    <filter id="textShadow">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.8"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <circle cx="256" cy="180" r="80" fill="none" stroke="url(#gold)" stroke-width="6" filter="url(#shadow)"/>
  <circle cx="256" cy="180" r="60" fill="none" stroke="#7c3aed" stroke-width="3" opacity="0.6"/>
  <circle cx="256" cy="180" r="40" fill="none" stroke="url(#gold)" stroke-width="2" opacity="0.4"/>
  <circle cx="256" cy="180" r="15" fill="url(#gold)" filter="url(#shadow)"/>
  <line x1="316" y1="120" x2="370" y2="66" stroke="url(#gold)" stroke-width="8" stroke-linecap="round" filter="url(#shadow)"/>
  <rect x="348" y="40" width="50" height="50" rx="8" fill="none" stroke="url(#gold)" stroke-width="6" transform="rotate(45, 373, 65)" filter="url(#shadow)"/>
  <ellipse cx="220" cy="200" rx="8" ry="6" fill="url(#gold)" opacity="0.8"/>
  <ellipse cx="292" cy="200" rx="8" ry="6" fill="url(#gold)" opacity="0.8"/>
  <path d="M230 215 Q256 230 282 215" fill="none" stroke="url(#gold)" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <text x="256" y="320" text-anchor="middle" font-family="Arial Black, Impact, sans-serif" font-size="72" font-weight="900" fill="url(#gold)" filter="url(#textShadow)" letter-spacing="4">BLUFFIX</text>
  <text x="256" y="358" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#a78bfa" letter-spacing="8">IMPOSTOR GAME</text>
  <path d="M100 380 L256 430 L412 380" fill="none" stroke="url(#glow)" stroke-width="2" opacity="0.3"/>
  <circle cx="80" cy="100" r="2" fill="#a78bfa" opacity="0.5"/>
  <circle cx="430" cy="80" r="3" fill="#a78bfa" opacity="0.4"/>
  <circle cx="60" cy="350" r="2" fill="#7c3aed" opacity="0.3"/>
  <circle cx="450" cy="320" r="2" fill="#a78bfa" opacity="0.4"/>
  <circle cx="150" cy="420" r="1.5" fill="#7c3aed" opacity="0.3"/>
  <circle cx="380" cy="440" r="2" fill="#a78bfa" opacity="0.3"/>
</svg>`;

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
  <circle cx="150" cy="200" r="4" fill="#a78bfa" opacity="0.4"/>
  <circle cx="870" cy="160" r="5" fill="#a78bfa" opacity="0.3"/>
  <circle cx="120" cy="700" r="3" fill="#7c3aed" opacity="0.3"/>
  <circle cx="900" cy="640" r="4" fill="#a78bfa" opacity="0.3"/>
  <circle cx="300" cy="850" r="3" fill="#7c3aed" opacity="0.2"/>
  <circle cx="720" cy="880" r="4" fill="#a78bfa" opacity="0.2"/>
</svg>`;

const ICON_SIZES = [
  { name: 'mipmap-mdpi', size: 48 },
  { name: 'mipmap-hdpi', size: 72 },
  { name: 'mipmap-xhdpi', size: 96 },
  { name: 'mipmap-xxhdpi', size: 144 },
  { name: 'mipmap-xxxhdpi', size: 192 },
];

const RES_DIR = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function generate() {
  console.log('Generating splash screen...');
  const splashDir = path.join(PUBLIC_DIR);
  fs.mkdirSync(splashDir, { recursive: true });
  await sharp(Buffer.from(SPLASH_SVG)).resize(1024, 1024).png().toFile(path.join(PUBLIC_DIR, 'splash.png'));

  console.log('Generating app icons...');
  for (const { name, size } of ICON_SIZES) {
    const dir = path.join(RES_DIR, name);
    fs.mkdirSync(dir, { recursive: true });

    const svgBuf = Buffer.from(SVG_LOGO);

    await sharp(svgBuf).resize(size, size).png().toFile(path.join(dir, 'ic_launcher.png'));
    await sharp(svgBuf).resize(size, size).png().toFile(path.join(dir, 'ic_launcher_foreground.png'));

    const roundSize = Math.round(size * 1.2);
    const roundSvg = SVG_LOGO.replace('rx="96"', 'rx="256"');
    await sharp(Buffer.from(roundSvg)).resize(roundSize, roundSize).png().toFile(path.join(dir, 'ic_launcher_round.png'));

    console.log(`  ${name}: ${size}x${size} OK`);
  }

  console.log('Done!');
}

generate().catch(e => { console.error(e); process.exit(1); });
