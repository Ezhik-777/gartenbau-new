import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const sourceImage = join(publicDir, 'img', 'logo.png');

async function generateFavicons() {
  console.log('Generating favicons from', sourceImage);

  // favicon-32x32.png
  await sharp(sourceImage)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('  Created favicon-32x32.png');

  // favicon-16x16.png
  await sharp(sourceImage)
    .resize(16, 16)
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('  Created favicon-16x16.png');

  // favicon.ico (32x32 PNG, browsers accept this)
  await sharp(sourceImage)
    .resize(32, 32)
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('  Created favicon.ico (32x32 PNG)');

  // apple-touch-icon.png (180x180)
  await sharp(sourceImage)
    .resize(180, 180)
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('  Created apple-touch-icon.png (180x180)');

  console.log('Done!');
}

generateFavicons().catch(console.error);
