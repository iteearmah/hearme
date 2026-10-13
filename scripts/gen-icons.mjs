/**
 * Generates the full PWA icon set from one SVG source using sharp.
 * Run: npm run icons
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/icons");

/** Full-bleed gradient mark with the "chat heart" glyph. */
const mark = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="55%" stop-color="#d1467f"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <linearGradient id="bubble" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#fbeef6"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#3b0d25" flood-opacity="0.28"/>
    </filter>
  </defs>

  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="120" cy="96" r="120" fill="#ffffff" opacity="0.10"/>
  <circle cx="430" cy="440" r="150" fill="#ffffff" opacity="0.08"/>

  <g filter="url(#soft)">
    <path d="M256 96c-84 0-152 54-152 121 0 38 20 72 52 94l-14 61c-2 9 8 15 15 10l63-44c11 2 23 3 36 3 84 0 152-54 152-121S340 96 256 96z" fill="url(#bubble)"/>
  </g>

  <path d="M256 246c-14-19-46-19-61-2-19 22-6 51 22 68 12 8 22 13 22 13s10-5 22-13c28-17 41-46 22-68-15-17-47-17-61 2z" fill="#d1467f"/>
  <path d="M172 150h70M172 176h44" stroke="#d1467f" stroke-opacity="0.45" stroke-width="14" stroke-linecap="round"/>
</svg>`;

/** Maskable: same mark, but shrunk into the 80% safe zone. */
const maskable = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f472b6"/>
      <stop offset="55%" stop-color="#d1467f"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#bg2)"/>
  <g transform="translate(256 256) scale(0.72) translate(-256 -256)">
    <path d="M256 96c-84 0-152 54-152 121 0 38 20 72 52 94l-14 61c-2 9 8 15 15 10l63-44c11 2 23 3 36 3 84 0 152-54 152-121S340 96 256 96z" fill="#ffffff"/>
    <path d="M256 246c-14-19-46-19-61-2-19 22-6 51 22 68 12 8 22 13 22 13s10-5 22-13c28-17 41-46 22-68-15-17-47-17-61 2z" fill="#d1467f"/>
    <path d="M172 150h70M172 176h44" stroke="#d1467f" stroke-opacity="0.45" stroke-width="14" stroke-linecap="round"/>
  </g>
</svg>`;

/** Monochrome favicon that works on any browser tab background. */
const favicon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="15" fill="#d1467f"/>
  <path d="M32 13c-11 0-20 7-20 16 0 5 3 9 7 12l-2 8c0 1 1 2 2 1l8-6 5 1c11 0 20-7 20-16s-9-16-20-16z" fill="#fff"/>
  <path d="M32 34c-2-2-6-2-8 0-3 3-1 7 3 9 2 1 3 2 3 2s2-1 3-2c4-2 6-6 3-9-2-2-6-2-8 0z" fill="#d1467f"/>
</svg>`;


async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(resolve(root, "public"), { recursive: true });

  const png = async (svg, size, file) => {
    const buf = await sharp(Buffer.from(svg))
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await writeFile(resolve(outDir, file), buf);
    console.log("✓", file, size + "px");
  };

  await png(mark, 192, "icon-192.png");
  await png(mark, 512, "icon-512.png");
  await png(mark, 180, "apple-touch-icon.png");
  await png(mark, 32, "favicon-32.png");
  await png(maskable, 512, "maskable-512.png");
  await writeFile(resolve(root, "public/icons/maskable.svg"), maskable);
  await writeFile(resolve(root, "public/icon.svg"), mark);
  await writeFile(resolve(root, "public/favicon.svg"), favicon);
  console.log("✓ svg sources");
}

main();