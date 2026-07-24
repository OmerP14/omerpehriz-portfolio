// One-off dev utility: generates the temporary /public/projects/*.webp thumbnails.
// Re-run with `node scripts/generate-project-placeholders.mjs` if you add a new
// project and want a matching placeholder before dropping in a real screenshot.
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "public", "projects");
mkdirSync(OUT_DIR, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 800;

const BG_DARK = "#07070f";
const BG_SURFACE = "#0d0d1a";

/** Simple stroked-line glyphs, drawn in a 100x100 box, one per category. */
const icons = {
  dashboard: `
    <rect x="18" y="18" width="64" height="64" rx="8" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <rect x="27" y="46" width="12" height="24" rx="2" fill="currentColor" opacity="0.9"/>
    <rect x="44" y="36" width="12" height="34" rx="2" fill="currentColor" opacity="0.9"/>
    <rect x="61" y="52" width="12" height="18" rx="2" fill="currentColor" opacity="0.9"/>
    <path d="M27 32 L40 24 L52 30 L73 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
  `,
  aiNodes: `
    <circle cx="50" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <circle cx="26" cy="58" r="7" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <circle cx="74" cy="58" r="7" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <circle cx="50" cy="80" r="6" fill="currentColor" opacity="0.9"/>
    <path d="M50 33 L26 51 M50 33 L74 51 M32 62 L50 76 M68 62 L50 76 M33 58 L67 58" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.8"/>
  `,
  homeSearch: `
    <path d="M22 46 L50 22 L78 46" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30 42 V74 H70 V42" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>
    <rect x="45" y="54" width="10" height="20" fill="currentColor" opacity="0.85"/>
    <circle cx="66" cy="62" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
    <line x1="73" y1="69" x2="82" y2="78" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  `,
  fitness: `
    <rect x="14" y="44" width="10" height="18" rx="2" fill="currentColor" opacity="0.9"/>
    <rect x="76" y="44" width="10" height="18" rx="2" fill="currentColor" opacity="0.9"/>
    <rect x="24" y="49" width="6" height="8" fill="currentColor" opacity="0.6"/>
    <rect x="70" y="49" width="6" height="8" fill="currentColor" opacity="0.6"/>
    <line x1="30" y1="53" x2="70" y2="53" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    <path d="M20 76 L34 62 L46 70 L62 50" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
  `,
  drone: `
    <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <line x1="30" y1="30" x2="42" y2="42" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="70" y1="30" x2="58" y2="42" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="30" y1="70" x2="42" y2="58" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="58" y2="58" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="26" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="74" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="26" cy="74" r="7" fill="none" stroke="currentColor" stroke-width="3"/>
    <circle cx="74" cy="74" r="7" fill="none" stroke="currentColor" stroke-width="3"/>
    <path d="M50 40 L50 20" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.6"/>
  `,
  iot: `
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.9"/>
    <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.55"/>
    <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" stroke-width="2.5" opacity="0.3"/>
    <circle cx="22" cy="30" r="5" fill="currentColor" opacity="0.85"/>
    <circle cx="80" cy="34" r="5" fill="currentColor" opacity="0.85"/>
    <circle cx="24" cy="76" r="5" fill="currentColor" opacity="0.85"/>
    <circle cx="78" cy="72" r="5" fill="currentColor" opacity="0.85"/>
    <path d="M22 30 L50 50 L80 34 M24 76 L50 50 L78 72" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
  `,
  browserCode: `
    <rect x="16" y="24" width="68" height="52" rx="6" fill="none" stroke="currentColor" stroke-width="3.5"/>
    <line x1="16" y1="37" x2="84" y2="37" stroke="currentColor" stroke-width="3"/>
    <circle cx="25" cy="30.5" r="2.2" fill="currentColor"/>
    <circle cx="33" cy="30.5" r="2.2" fill="currentColor"/>
    <circle cx="41" cy="30.5" r="2.2" fill="currentColor"/>
    <path d="M36 52 L28 60 L36 68 M64 52 L72 60 L64 68 M56 48 L48 72" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
  `,
  qr: `
    <rect x="18" y="18" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="58" y="18" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="18" y="58" width="24" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="4"/>
    <rect x="27" y="27" width="6" height="6" fill="currentColor"/>
    <rect x="67" y="27" width="6" height="6" fill="currentColor"/>
    <rect x="27" y="67" width="6" height="6" fill="currentColor"/>
    <rect x="58" y="58" width="8" height="8" fill="currentColor"/>
    <rect x="70" y="58" width="12" height="8" fill="currentColor" opacity="0.6"/>
    <rect x="58" y="70" width="8" height="12" fill="currentColor" opacity="0.6"/>
    <rect x="70" y="72" width="12" height="10" fill="currentColor" opacity="0.9"/>
  `,
};

const projects = [
  {
    file: "special-education-saas.webp",
    label: "SaaS Platform",
    title: "Özel Eğitim Yönetim Sistemi",
    icon: "dashboard",
    from: "#6366f1",
    to: "#a855f7",
  },
  {
    file: "workify-ai.webp",
    label: "AI Web Application",
    title: "Workify AI",
    icon: "aiNodes",
    from: "#8b5cf6",
    to: "#ec4899",
  },
  {
    file: "easy-home.webp",
    label: "Full-Stack Web Application",
    title: "Easy Home Rent",
    icon: "homeSearch",
    from: "#3b82f6",
    to: "#6366f1",
  },
  {
    file: "myfitly.webp",
    label: "Mobile Application",
    title: "MyFitly",
    icon: "fitness",
    from: "#10b981",
    to: "#06b6d4",
  },
  {
    file: "firefighting-drone.webp",
    label: "Embedded Systems",
    title: "Yangın Söndürme Dronu",
    icon: "drone",
    from: "#ef4444",
    to: "#f97316",
  },
  {
    file: "iot-monitoring.webp",
    label: "IoT Project",
    title: "IoT Akıllı İzleme",
    icon: "iot",
    from: "#06b6d4",
    to: "#3b82f6",
  },
  {
    file: "portfolio.webp",
    label: "Portfolio Website",
    title: "Kişisel Portföy Sitesi",
    icon: "browserCode",
    from: "#6366f1",
    to: "#ec4899",
  },
  {
    file: "qr-reader.webp",
    label: "Python Automation",
    title: "PDF QR Reader",
    icon: "qr",
    from: "#475569",
    to: "#6366f1",
  },
];

function buildSvg({ icon: iconKey, from, to }) {
  const icon = icons[iconKey] ?? "";
  const gradId = "g1";
  const glowId = "glow";
  return `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BG_SURFACE}"/>
      <stop offset="100%" stop-color="${BG_DARK}"/>
    </linearGradient>
    <radialGradient id="blobA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${from}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${from}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${to}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${to}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${glowId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.05"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#${gradId})"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <circle cx="${WIDTH * 0.22}" cy="${HEIGHT * 0.3}" r="340" fill="url(#blobA)"/>
  <circle cx="${WIDTH * 0.82}" cy="${HEIGHT * 0.75}" r="380" fill="url(#blobB)"/>

  <!-- central icon card -->
  <g transform="translate(${WIDTH / 2 - 100}, ${HEIGHT / 2 - 100})">
    <rect x="0" y="0" width="200" height="200" rx="40" fill="#ffffff" opacity="0.04"/>
    <rect x="0" y="0" width="200" height="200" rx="40" fill="none" stroke="#ffffff" stroke-opacity="0.12" stroke-width="1.5"/>
    <g transform="translate(50, 50) scale(1)">
      ${icon.replace(/currentColor/g, "#eef0ff")}
    </g>
  </g>
</svg>`;
}

async function run() {
  for (const project of projects) {
    const svg = buildSvg(project);
    const outPath = path.join(OUT_DIR, project.file);
    await sharp(Buffer.from(svg)).webp({ quality: 90 }).toFile(outPath);
    console.log("wrote", outPath);
  }
}

run();
