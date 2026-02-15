#!/usr/bin/env node

/**
 * Performance Test Script
 * Tests bundle sizes and generates a performance report
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const DIST_DIR = './dist';
const THRESHOLDS = {
  js: 60 * 1024, // 60 KB
  css: 40 * 1024, // 40 KB
  images: 800 * 1024, // 800 KB initial load
};

function getFilesRecursive(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      getFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  console.log('📊 Performance Analysis Report\n');
  console.log('=' .repeat(60));

  const files = getFilesRecursive(DIST_DIR);

  const stats = {
    js: { total: 0, files: [] },
    css: { total: 0, files: [] },
    images: { total: 0, files: [] },
    other: { total: 0, files: [] }
  };

  files.forEach(file => {
    const stat = statSync(file);
    const size = stat.size;
    const ext = extname(file).toLowerCase();
    const relativePath = file.replace(DIST_DIR + '/', '');

    if (ext === '.js' || ext === '.mjs') {
      stats.js.total += size;
      stats.js.files.push({ path: relativePath, size });
    } else if (ext === '.css') {
      stats.css.total += size;
      stats.css.files.push({ path: relativePath, size });
    } else if (['.webp', '.jpg', '.png', '.svg'].includes(ext)) {
      stats.images.total += size;
      stats.images.files.push({ path: relativePath, size });
    } else {
      stats.other.total += size;
    }
  });

  // Report JavaScript
  console.log('\n📦 JavaScript Bundles:');
  console.log(`Total: ${formatBytes(stats.js.total)} / ${formatBytes(THRESHOLDS.js)} (${stats.js.total <= THRESHOLDS.js ? '✅' : '❌'})`);
  stats.js.files
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach(f => console.log(`  ${formatBytes(f.size).padStart(10)} - ${f.path}`));

  // Report CSS
  console.log('\n🎨 CSS Bundles:');
  console.log(`Total: ${formatBytes(stats.css.total)} / ${formatBytes(THRESHOLDS.css)} (${stats.css.total <= THRESHOLDS.css ? '✅' : '❌'})`);
  stats.css.files
    .sort((a, b) => b.size - a.size)
    .forEach(f => console.log(`  ${formatBytes(f.size).padStart(10)} - ${f.path}`));

  // Report Images (show first 20 loaded)
  console.log('\n🖼️  Images (first 20):');
  const initialImages = stats.images.files
    .filter(f => f.path.includes('image_') && !f.path.includes('optimized'))
    .slice(0, 20);
  const initialImagesSize = initialImages.reduce((sum, f) => sum + f.size, 0);
  console.log(`Initial load: ${formatBytes(initialImagesSize)} / ${formatBytes(THRESHOLDS.images)} (${initialImagesSize <= THRESHOLDS.images ? '✅' : '❌'})`);
  console.log(`Total images: ${stats.images.files.length} (${formatBytes(stats.images.total)})`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📈 Summary:');
  const totalSize = stats.js.total + stats.css.total + stats.images.total + stats.other.total;
  console.log(`Total bundle size: ${formatBytes(totalSize)}`);
  console.log(`  - JavaScript: ${formatBytes(stats.js.total)}`);
  console.log(`  - CSS: ${formatBytes(stats.css.total)}`);
  console.log(`  - Images: ${formatBytes(stats.images.total)}`);
  console.log(`  - Other: ${formatBytes(stats.other.total)}`);

  // Pass/Fail
  console.log('\n✅ Performance Checks:');
  console.log(`  - JS Bundle: ${stats.js.total <= THRESHOLDS.js ? '✅ PASS' : '❌ FAIL'} (${formatBytes(stats.js.total)} / ${formatBytes(THRESHOLDS.js)})`);
  console.log(`  - CSS Bundle: ${stats.css.total <= THRESHOLDS.css ? '✅ PASS' : '❌ FAIL'} (${formatBytes(stats.css.total)} / ${formatBytes(THRESHOLDS.css)})`);
  console.log(`  - Initial Images: ${initialImagesSize <= THRESHOLDS.images ? '✅ PASS' : '❌ FAIL'} (${formatBytes(initialImagesSize)} / ${formatBytes(THRESHOLDS.images)})`);

  const allPassed =
    stats.js.total <= THRESHOLDS.js &&
    stats.css.total <= THRESHOLDS.css &&
    initialImagesSize <= THRESHOLDS.images;

  console.log(`\n${allPassed ? '🎉 All performance checks passed!' : '⚠️  Some performance checks failed.'}\n`);

  return allPassed ? 0 : 1;
}

try {
  const exitCode = analyzeBundle();
  process.exit(exitCode);
} catch (error) {
  console.error('❌ Error analyzing bundle:', error.message);
  process.exit(1);
}
