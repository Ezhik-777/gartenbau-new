/**
 * Image Optimization Script
 * Processes all WebP images and creates responsive variants
 * Uses Sharp library for high-quality image processing
 */

import sharp from 'sharp';
import { glob } from 'glob';
import { basename, dirname, join } from 'path';
import { mkdir, access, constants } from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CONFIG = {
  inputPattern: 'public/img/image_*.webp',
  outputDir: 'public/img/optimized',
  sizes: {
    sm: 640,
    md: 1024,
    lg: 1920,
  },
  quality: {
    sm: 80,
    md: 85,
    lg: 85,
  },
};

/**
 * Ensure output directory exists
 */
async function ensureOutputDir() {
  try {
    await access(CONFIG.outputDir, constants.F_OK);
    console.log('✓ Output directory exists');
  } catch {
    await mkdir(CONFIG.outputDir, { recursive: true });
    console.log('✓ Created output directory:', CONFIG.outputDir);
  }
}

/**
 * Get optimized filename
 * @param {string} originalPath - Original image path
 * @param {string} size - Size variant (sm, md, lg)
 * @returns {string} Optimized filename
 */
function getOptimizedFilename(originalPath, size) {
  const name = basename(originalPath, '.webp');
  return `${name}-${size}.webp`;
}

/**
 * Check if optimized image already exists
 * @param {string} outputPath - Path to check
 * @returns {Promise<boolean>}
 */
async function imageExists(outputPath) {
  try {
    await access(outputPath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Optimize a single image to multiple sizes
 * @param {string} imagePath - Path to source image
 */
async function optimizeImage(imagePath) {
  const imageName = basename(imagePath);
  console.log(`\nProcessing: ${imageName}`);

  try {
    // Get image metadata
    const metadata = await sharp(imagePath).metadata();
    console.log(`  Original size: ${metadata.width}x${metadata.height}`);

    // Process each size variant
    for (const [sizeName, width] of Object.entries(CONFIG.sizes)) {
      const outputFilename = getOptimizedFilename(imagePath, sizeName);
      const outputPath = join(CONFIG.outputDir, outputFilename);

      // Skip if already exists
      if (await imageExists(outputPath)) {
        console.log(`  ↳ ${sizeName} (${width}w) - already exists, skipping`);
        continue;
      }

      // Skip if source is smaller than target
      if (metadata.width && metadata.width < width) {
        console.log(`  ↳ ${sizeName} (${width}w) - source too small, skipping`);
        continue;
      }

      // Generate optimized variant
      await sharp(imagePath)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside',
        })
        .webp({
          quality: CONFIG.quality[sizeName],
          effort: 6, // Higher effort = better compression
        })
        .toFile(outputPath);

      const stats = await sharp(outputPath).metadata();
      console.log(`  ✓ ${sizeName} (${width}w) - ${stats.width}x${stats.height}`);
    }
  } catch (error) {
    console.error(`  ✗ Error processing ${imageName}:`, error.message);
  }
}

/**
 * Main optimization function
 */
async function optimizeAllImages() {
  console.log('🖼️  Starting image optimization...\n');
  console.log('Configuration:');
  console.log('  Input pattern:', CONFIG.inputPattern);
  console.log('  Output directory:', CONFIG.outputDir);
  console.log('  Sizes:', CONFIG.sizes);
  console.log('  Quality:', CONFIG.quality);

  // Ensure output directory exists
  await ensureOutputDir();

  // Find all images matching pattern
  const images = await glob(CONFIG.inputPattern);

  if (images.length === 0) {
    console.log('\n⚠️  No images found matching pattern:', CONFIG.inputPattern);
    console.log('Make sure you are running this from the astro-site directory');
    process.exit(1);
  }

  console.log(`\n📊 Found ${images.length} images to process\n`);
  console.log('─'.repeat(60));

  // Process each image
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const imagePath of images) {
    try {
      await optimizeImage(imagePath);
      processed++;
    } catch (error) {
      console.error(`\n✗ Failed to process ${basename(imagePath)}:`, error.message);
      errors++;
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log('\n✅ Optimization complete!');
  console.log(`   Processed: ${processed} images`);
  if (errors > 0) {
    console.log(`   Errors: ${errors} images`);
  }
  console.log(`\n📁 Optimized images saved to: ${CONFIG.outputDir}`);
}

// Run optimization
optimizeAllImages().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
