/**
 * generate-icons.js - Generate PWA icons from SVG favicon
 * Requires: npm install sharp
 * Run: node scripts/generate-icons.js
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const iconsDir = join(publicDir, 'icons');

// Icon sizes needed for manifest.json and various devices
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Ensure icons directory exists
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Read the SVG file
const svgPath = join(publicDir, 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating PWA icons...');

  // Generate manifest icons
  for (const size of iconSizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(iconsDir, `icon-${size}x${size}.png`));
    console.log(`  Created: icons/icon-${size}x${size}.png`);
  }

  // Generate favicon PNGs
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('  Created: favicon-16x16.png');

  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('  Created: favicon-32x32.png');

  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('  Created: apple-touch-icon.png');

  // Generate OG image placeholder (simple green background with text concept)
  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 46, g: 125, b: 50, alpha: 1 }
    }
  })
    .png()
    .toFile(join(publicDir, 'images', 'og-image.webp'));
  console.log('  Created: images/og-image.webp');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
