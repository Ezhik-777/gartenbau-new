/**
 * Service Worker Integration Test
 * Validates service worker configuration and functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'blue') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  console.log(`${colors.green}✓ ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}✗ ${message}${colors.reset}`);
}

function warn(message) {
  console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
}

let testsPassed = 0;
let testsFailed = 0;

/**
 * Test 1: Service Worker File Exists
 */
function testServiceWorkerExists() {
  log('\nTest 1: Service Worker File Exists', 'blue');

  const publicSwPath = path.join(projectRoot, 'public', 'service-worker.js');
  const distSwPath = path.join(projectRoot, 'dist', 'service-worker.js');

  if (!fs.existsSync(publicSwPath)) {
    error('public/service-worker.js does not exist');
    testsFailed++;
    return;
  }

  success('public/service-worker.js exists');

  if (!fs.existsSync(distSwPath)) {
    warn('dist/service-worker.js not found (run build first)');
  } else {
    success('dist/service-worker.js exists');
  }

  testsPassed++;
}

/**
 * Test 2: Offline Page Exists
 */
function testOfflinePageExists() {
  log('\nTest 2: Offline Page Exists', 'blue');

  const publicOfflinePath = path.join(projectRoot, 'public', 'offline.html');
  const distOfflinePath = path.join(projectRoot, 'dist', 'offline.html');

  if (!fs.existsSync(publicOfflinePath)) {
    error('public/offline.html does not exist');
    testsFailed++;
    return;
  }

  success('public/offline.html exists');

  if (!fs.existsSync(distOfflinePath)) {
    warn('dist/offline.html not found (run build first)');
  } else {
    success('dist/offline.html exists');
  }

  testsPassed++;
}

/**
 * Test 3: Service Worker Content Validation
 */
function testServiceWorkerContent() {
  log('\nTest 3: Service Worker Content Validation', 'blue');

  const swPath = path.join(projectRoot, 'public', 'service-worker.js');

  if (!fs.existsSync(swPath)) {
    error('Service worker file not found');
    testsFailed++;
    return;
  }

  const content = fs.readFileSync(swPath, 'utf-8');

  // Check for Workbox
  if (!content.includes('workbox-sw.js')) {
    error('Workbox CDN import not found');
    testsFailed++;
    return;
  }
  success('Workbox CDN import found');

  // Check for cache strategies
  const strategies = ['CacheFirst', 'NetworkFirst', 'StaleWhileRevalidate'];
  strategies.forEach((strategy) => {
    if (!content.includes(strategy)) {
      error(`${strategy} strategy not found`);
      testsFailed++;
    } else {
      success(`${strategy} strategy found`);
    }
  });

  // Check for background sync
  if (!content.includes('BackgroundSyncPlugin')) {
    error('BackgroundSyncPlugin not found');
    testsFailed++;
  } else {
    success('BackgroundSyncPlugin found');
  }

  // Check for offline fallback
  if (!content.includes('OFFLINE_PAGE')) {
    error('Offline page fallback not found');
    testsFailed++;
  } else {
    success('Offline page fallback found');
  }

  testsPassed++;
}

/**
 * Test 4: Service Worker Registration Component
 */
function testRegistrationComponent() {
  log('\nTest 4: Service Worker Registration Component', 'blue');

  const componentPath = path.join(
    projectRoot,
    'src',
    'components',
    'ServiceWorkerRegistration.astro'
  );

  if (!fs.existsSync(componentPath)) {
    error('ServiceWorkerRegistration.astro not found');
    testsFailed++;
    return;
  }

  success('ServiceWorkerRegistration.astro exists');

  const content = fs.readFileSync(componentPath, 'utf-8');

  // Check for service worker registration
  if (!content.includes('navigator.serviceWorker.register')) {
    error('Service worker registration code not found');
    testsFailed++;
  } else {
    success('Service worker registration code found');
  }

  // Check for update notification
  if (!content.includes('showUpdateNotification')) {
    error('Update notification handler not found');
    testsFailed++;
  } else {
    success('Update notification handler found');
  }

  testsPassed++;
}

/**
 * Test 5: MainLayout Integration
 */
function testMainLayoutIntegration() {
  log('\nTest 5: MainLayout Integration', 'blue');

  const layoutPath = path.join(projectRoot, 'src', 'layouts', 'MainLayout.astro');

  if (!fs.existsSync(layoutPath)) {
    error('MainLayout.astro not found');
    testsFailed++;
    return;
  }

  const content = fs.readFileSync(layoutPath, 'utf-8');

  // Check for ServiceWorkerRegistration import
  if (!content.includes('ServiceWorkerRegistration')) {
    error('ServiceWorkerRegistration not imported in MainLayout');
    testsFailed++;
  } else {
    success('ServiceWorkerRegistration imported in MainLayout');
  }

  // Check for component usage
  if (!content.includes('<ServiceWorkerRegistration')) {
    error('ServiceWorkerRegistration component not used in MainLayout');
    testsFailed++;
  } else {
    success('ServiceWorkerRegistration component used in MainLayout');
  }

  testsPassed++;
}

/**
 * Test 6: Workbox Build Script
 */
function testWorkboxBuildScript() {
  log('\nTest 6: Workbox Build Script', 'blue');

  const scriptPath = path.join(projectRoot, 'scripts', 'build-sw.js');

  if (!fs.existsSync(scriptPath)) {
    error('build-sw.js script not found');
    testsFailed++;
    return;
  }

  success('build-sw.js script exists');

  const content = fs.readFileSync(scriptPath, 'utf-8');

  // Check for workbox-build import
  if (!content.includes('workbox-build')) {
    error('workbox-build import not found');
    testsFailed++;
  } else {
    success('workbox-build import found');
  }

  // Check for injectManifest
  if (!content.includes('injectManifest')) {
    error('injectManifest function not used');
    testsFailed++;
  } else {
    success('injectManifest function found');
  }

  testsPassed++;
}

/**
 * Test 7: Package.json Scripts
 */
function testPackageJsonScripts() {
  log('\nTest 7: Package.json Scripts', 'blue');

  const packagePath = path.join(projectRoot, 'package.json');

  if (!fs.existsSync(packagePath)) {
    error('package.json not found');
    testsFailed++;
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

  // Check for build-sw script
  if (!packageJson.scripts || !packageJson.scripts['build-sw']) {
    error('build-sw script not found in package.json');
    testsFailed++;
  } else {
    success('build-sw script found in package.json');
  }

  // Check for workbox dependencies
  if (
    !packageJson.devDependencies ||
    !packageJson.devDependencies['workbox-build']
  ) {
    error('workbox-build not found in devDependencies');
    testsFailed++;
  } else {
    success('workbox-build found in devDependencies');
  }

  if (
    !packageJson.devDependencies ||
    !packageJson.devDependencies['workbox-window']
  ) {
    error('workbox-window not found in devDependencies');
    testsFailed++;
  } else {
    success('workbox-window found in devDependencies');
  }

  testsPassed++;
}

/**
 * Test 8: Dist Service Worker with Manifest
 */
function testDistServiceWorkerManifest() {
  log('\nTest 8: Dist Service Worker with Manifest', 'blue');

  const distSwPath = path.join(projectRoot, 'dist', 'service-worker.js');

  if (!fs.existsSync(distSwPath)) {
    warn('dist/service-worker.js not found (run build first)');
    warn('This test is skipped until build is run');
    return;
  }

  const content = fs.readFileSync(distSwPath, 'utf-8');

  // Check for injected manifest
  if (!content.includes('precacheAndRoute')) {
    error('precacheAndRoute not found');
    testsFailed++;
  } else {
    success('precacheAndRoute found');
  }

  // Check if manifest was injected (should have URLs)
  if (content.includes('self.__WB_MANIFEST')) {
    error('Manifest not injected (placeholder still present)');
    testsFailed++;
  } else {
    success('Workbox manifest was injected');
  }

  // Check for revision hashes
  if (!content.includes('"revision"')) {
    error('Revision hashes not found in manifest');
    testsFailed++;
  } else {
    success('Revision hashes found in manifest');
  }

  testsPassed++;
}

/**
 * Run all tests
 */
function runTests() {
  log('='.repeat(60), 'blue');
  log('Service Worker Integration Tests', 'blue');
  log('='.repeat(60), 'blue');

  testServiceWorkerExists();
  testOfflinePageExists();
  testServiceWorkerContent();
  testRegistrationComponent();
  testMainLayoutIntegration();
  testWorkboxBuildScript();
  testPackageJsonScripts();
  testDistServiceWorkerManifest();

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('Test Summary', 'blue');
  log('='.repeat(60), 'blue');

  const total = testsPassed + testsFailed;
  const passRate = ((testsPassed / total) * 100).toFixed(1);

  if (testsFailed === 0) {
    success(`All ${testsPassed} tests passed! ✨`);
  } else {
    log(`Tests passed: ${testsPassed}`, 'green');
    log(`Tests failed: ${testsFailed}`, 'red');
    log(`Pass rate: ${passRate}%`, testsFailed === 0 ? 'green' : 'yellow');
  }

  log('='.repeat(60) + '\n', 'blue');

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests();
