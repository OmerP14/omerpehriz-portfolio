// One-off dev utility: regenerates /public/og.png (social share preview image).
// Re-run with `node scripts/generate-og-image.mjs` if the name/title/branding changes.
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

const BG_DARK = "#07070f";
const BG_SURFACE = "#0d0d1a";

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG_SURFACE}"/>
      <stop offset="100%" stop-color="${BG_DARK}"/>
    </linearGradient>
    <radialGradient id="blobA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#ec4899" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.05"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <circle cx="${WIDTH * 0.12}" cy="${HEIGHT * 0.15}" r="300" fill="url(#blobA)"/>
  <circle cx="${WIDTH * 0.92}" cy="${HEIGHT * 0.95}" r="340" fill="url(#blobB)"/>

  <text x="100" y="270" font-family="Arial, sans-serif" font-size="76" font-weight="800" fill="#f0f0ff">Ömer Pehriz</text>
  <text x="100" y="335" font-family="Arial, sans-serif" font-size="40" font-weight="700" fill="url(#textGrad)">Software Engineer</text>
  <text x="100" y="400" font-family="Arial, sans-serif" font-size="26" fill="#8888aa">Building modern web, mobile, and SaaS applications.</text>
</svg>`;

async function run() {
  const logo = await sharp(path.join(ROOT, "public/images/profile/logom/pngler/favicon_white.png"))
    .trim()
    .resize(140, 140, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp(Buffer.from(svg))
    .composite([{ input: logo, left: WIDTH - 140 - 100, top: HEIGHT / 2 - 70 }])
    .png()
    .toFile(path.join(ROOT, "public/og.png"));

  console.log("wrote public/og.png");
}

run();
