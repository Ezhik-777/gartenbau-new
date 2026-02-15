/**
 * GARTENBAU Z.M. - Application Initialization v3.0
 * ================================================
 * Main entry point for site functionality
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    version: '3.0',
    siteName: 'Gartenbau Z.M.',
    enableServiceWorker: true,
    enableAnalytics: false,
    debug: false
  };

  /**
   * Initialize Service Worker for PWA functionality
   */
  function initServiceWorker() {
    if (!CONFIG.enableServiceWorker || !('serviceWorker' in navigator)) {
      return;
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          if (CONFIG.debug) {
            console.log('✅ Service Worker registered:', registration.scope);
          }

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                if (CONFIG.debug) {
                  console.log('🔄 New version available');
                }
              }
            });
          });
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });
  }

  /**
   * Initialize lazy loading for images
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
      });
    } else {
      // Fallback to IntersectionObserver
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Initialize external links to open in new tab
   */
  function initExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      const url = new URL(link.href);
      if (url.hostname !== window.location.hostname) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * Initialize form validation and submission
   */
  function initForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        // Let Formspree handle submission
        // Just add loading state
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent = 'Wird gesendet...';
        }
      });
    });
  }

  /**
   * Initialize performance monitoring
   */
  function initPerformanceMonitoring() {
    if (!CONFIG.debug || !window.performance) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('📊 Performance Metrics:');
        console.log(`   Page Load: ${pageLoadTime}ms`);
        console.log(`   Connect: ${connectTime}ms`);
        console.log(`   Render: ${renderTime}ms`);

        // Core Web Vitals (if available)
        if (window.PerformanceObserver) {
          // Largest Contentful Paint
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log(`   LCP: ${lastEntry.renderTime || lastEntry.loadTime}ms`);
          }).observe({ entryTypes: ['largest-contentful-paint'] });

          // First Input Delay
          new PerformanceObserver((entryList) => {
            const firstInput = entryList.getEntries()[0];
            console.log(`   FID: ${firstInput.processingStart - firstInput.startTime}ms`);
          }).observe({ entryTypes: ['first-input'] });

          // Cumulative Layout Shift
          new PerformanceObserver((entryList) => {
            let cls = 0;
            entryList.getEntries().forEach(entry => {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            });
            console.log(`   CLS: ${cls}`);
          }).observe({ entryTypes: ['layout-shift'] });
        }
      }, 0);
    });
  }

  /**
   * Main initialization
   */
  function init() {
    if (CONFIG.debug) {
      console.log(`🚀 ${CONFIG.siteName} v${CONFIG.version} initialized`);
    }

    // Initialize core features
    initServiceWorker();
    initLazyLoading();
    initExternalLinks();
    initSmoothScroll();
    initForms();
    initPerformanceMonitoring();

    // Dispatch custom event for other scripts
    document.dispatchEvent(new CustomEvent('appInitialized', {
      detail: { version: CONFIG.version }
    }));
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose config for debugging
  if (CONFIG.debug) {
    window.GartenbauApp = { CONFIG };
  }

})();
