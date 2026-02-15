import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gartenbauzm.de',
  integrations: [
    react()
    // sitemap disabled due to plugin bug - using manual sitemap.xml
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  vite: {
    css: {
      postcss: './postcss.config.cjs'
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Code splitting strategy
            if (id.includes('node_modules')) {
              // Vendor chunks
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('aos')) {
                return 'aos-vendor';
              }
              if (id.includes('react-compare-slider')) {
                return 'compare-slider-vendor';
              }
              return 'vendor';
            }
            // Gallery page gets its own chunk
            if (id.includes('GalleryGrid')) {
              return 'gallery';
            }
            if (id.includes('BeforeAfterSlider')) {
              return 'before-after';
            }
          }
        }
      },
      // Minification options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  },
  compressHTML: true,
  output: 'static'
});
