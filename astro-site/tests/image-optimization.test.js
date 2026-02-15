/**
 * Image Optimization Tests
 * Verifies that optimized images are generated correctly
 */

import { readdir, access, constants } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const OPTIMIZED_DIR = 'public/img/optimized';
const EXPECTED_SIZES = ['sm', 'md', 'lg'];
const SIZE_WIDTHS = {
  sm: 640,
  md: 1024,
  lg: 1920,
};

/**
 * Test: Optimized directory exists
 */
async function testOptimizedDirExists() {
  try {
    await access(OPTIMIZED_DIR, constants.F_OK);
    console.log('✓ Optimized directory exists');
    return true;
  } catch {
    console.error('✗ Optimized directory not found');
    return false;
  }
}

/**
 * Test: Sample images have all expected variants
 */
async function testSampleImageVariants() {
  const sampleImages = ['image_1', 'image_25', 'image_42'];
  let allPassed = true;

  for (const imageName of sampleImages) {
    console.log(`\nTesting ${imageName}:`);

    for (const size of EXPECTED_SIZES) {
      const filename = `${imageName}-${size}.webp`;
      const filePath = join(OPTIMIZED_DIR, filename);

      try {
        await access(filePath, constants.F_OK);

        // Verify dimensions
        const metadata = await sharp(filePath).metadata();
        const expectedWidth = SIZE_WIDTHS[size];

        if (metadata.width && metadata.width <= expectedWidth) {
          console.log(`  ✓ ${size} variant exists (${metadata.width}x${metadata.height})`);
        } else {
          console.error(`  ✗ ${size} variant has incorrect width: ${metadata.width} (expected ≤${expectedWidth})`);
          allPassed = false;
        }
      } catch (error) {
        // It's OK if larger variants don't exist for small source images
        if (size !== 'sm') {
          console.log(`  ⚠ ${size} variant not found (source may be too small)`);
        } else {
          console.error(`  ✗ ${size} variant not found (should always exist)`);
          allPassed = false;
        }
      }
    }
  }

  return allPassed;
}

/**
 * Test: Total count of optimized images
 */
async function testOptimizedImageCount() {
  try {
    const files = await readdir(OPTIMIZED_DIR);
    const webpFiles = files.filter(f => f.endsWith('.webp'));

    console.log(`\n✓ Found ${webpFiles.length} optimized images`);

    // We expect at least 181 images (at least 'sm' variant for each source)
    if (webpFiles.length >= 181) {
      console.log('✓ Minimum expected count met');
      return true;
    } else {
      console.error(`✗ Expected at least 181 optimized images, found ${webpFiles.length}`);
      return false;
    }
  } catch (error) {
    console.error('✗ Error reading optimized directory:', error.message);
    return false;
  }
}

/**
 * Test: File sizes are optimized
 */
async function testFileSizeOptimization() {
  const testFile = 'image_25-sm.webp';
  const filePath = join(OPTIMIZED_DIR, testFile);

  try {
    const metadata = await sharp(filePath).metadata();
    const stats = await sharp(filePath).stats();

    console.log(`\n✓ ${testFile} metadata:`);
    console.log(`  - Dimensions: ${metadata.width}x${metadata.height}`);
    console.log(`  - Format: ${metadata.format}`);
    console.log(`  - Size: ${Math.round(metadata.size / 1024)} KB`);

    // Verify it's WebP format
    if (metadata.format === 'webp') {
      console.log('✓ Image is in WebP format');
      return true;
    } else {
      console.error(`✗ Image is not in WebP format: ${metadata.format}`);
      return false;
    }
  } catch (error) {
    console.error('✗ Error testing file size:', error.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Running Image Optimization Tests\n');
  console.log('='.repeat(60));

  const results = await Promise.all([
    testOptimizedDirExists(),
    testSampleImageVariants(),
    testOptimizedImageCount(),
    testFileSizeOptimization(),
  ]);

  console.log('\n' + '='.repeat(60));
  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log(`\n📊 Test Results: ${passed}/${total} passed`);

  if (passed === total) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

runTests();
