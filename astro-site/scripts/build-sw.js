/**
 * Service Worker Build Script
 * Uses Workbox to inject precache manifest into service worker
 */

import { injectManifest, copyWorkboxLibraries } from 'workbox-build';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function buildServiceWorker() {
  try {
    console.log('[Workbox] Building Service Worker with precache manifest...');

    // Copy Workbox libraries to dist for local use (security improvement)
    await copyWorkboxLibraries(join(projectRoot, 'dist'));
    console.log('[Workbox] ✅ Copied Workbox runtime libraries to dist/');

    const { count, size, warnings } = await injectManifest({
      // Source service worker file (template)
      swSrc: join(projectRoot, 'public', 'service-worker.js'),

      // Destination service worker file (with injected manifest)
      swDest: join(projectRoot, 'dist', 'service-worker.js'),

      // Directory to scan for files to precache
      globDirectory: join(projectRoot, 'dist'),

      // Patterns for files to precache
      globPatterns: [
        // HTML pages
        '**/*.html',

        // Critical CSS and JS in assets folder
        'assets/**/*.css',
        'assets/**/*.js',

        // Essential images (logo, critical assets)
        'img/logo.{png,webp}',

        // PWA assets
        'manifest.json',
      ],

      // Files to ignore
      globIgnores: [
        // Large gallery images (handled by runtime caching)
        'img/image_*.webp',
        'img/optimized/**',

        // Build artifacts
        '**/*.map',
        '**/node_modules/**',

        // Service worker itself
        'service-worker.js',
      ],

      // Manifest injection point in service worker
      injectionPoint: 'self.__WB_MANIFEST',

      // Don't include revision info for URLs that already have hashes
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,

      // Maximum file size to precache (2MB)
      maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,

      // Manifest transforms
      manifestTransforms: [
        // Add custom logic to transform manifest entries
        (manifestEntries) => {
          const manifest = manifestEntries.map((entry) => {
            // Remove query strings from URLs
            const url = entry.url.split('?')[0];

            return {
              ...entry,
              url,
            };
          });

          return { manifest };
        },
      ],
    });

    console.log(`[Workbox] ✅ Service Worker built successfully!`);
    console.log(`[Workbox] 📦 Precached ${count} files (${formatBytes(size)})`);

    if (warnings.length > 0) {
      console.warn('[Workbox] ⚠️  Warnings:');
      warnings.forEach((warning) => console.warn(`  - ${warning}`));
    }

    // Log precache strategy summary
    console.log('\n[Workbox] 📋 Caching Strategy:');
    console.log('  • HTML: Network First (3s timeout)');
    console.log('  • CSS/JS: Stale While Revalidate (7 days)');
    console.log('  • Images: Cache First (30 days, max 100 entries)');
    console.log('  • Fonts: Cache First (1 year)');
    console.log('  • Forms: Background Sync (24h retry)');
    console.log('  • Offline: Fallback to /offline.html\n');

  } catch (error) {
    console.error('[Workbox] ❌ Build failed:', error);
    process.exit(1);
  }
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run build
buildServiceWorker();
