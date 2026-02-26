import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imgDir = join(__dirname, '..', 'public', 'img');
const outputDir = join(imgDir, 'optimized');

const SIZES = [
  { suffix: '-sm', width: 640, quality: 75 },
  { suffix: '-md', width: 1024, quality: 80 },
  { suffix: '-lg', width: 1920, quality: 80 },
];

async function optimizeImages() {
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const files = readdirSync(imgDir).filter(
    (f) => f.endsWith('.webp') && (f.startsWith('image_') || f === 'hero-garden.webp')
  );

  console.log(`Found ${files.length} images to process`);
  let created = 0;
  let skipped = 0;

  for (const file of files) {
    const name = basename(file, extname(file));
    const sourcePath = join(imgDir, file);

    for (const { suffix, width, quality } of SIZES) {
      const outputName = `${name}${suffix}.webp`;
      const outputPath = join(outputDir, outputName);

      if (existsSync(outputPath)) {
        skipped++;
        continue;
      }

      try {
        await sharp(sourcePath)
          .resize(width, null, { withoutEnlargement: true })
          .webp({ quality })
          .toFile(outputPath);
        created++;
      } catch (err) {
        console.error(`  Error processing ${file} (${suffix}):`, err.message);
      }
    }
  }

  console.log(`Done! Created: ${created}, Skipped (already exist): ${skipped}`);
}

optimizeImages().catch(console.error);
