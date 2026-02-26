import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gartenbauzm.de',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('before-after-demo'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
              if (id.includes('react-compare-slider')) return 'compare-slider-vendor';
              return 'vendor';
            }
            if (id.includes('GalleryGrid')) return 'gallery';
            if (id.includes('BeforeAfterSlider')) return 'before-after';
          },
        },
      },
      minify: 'terser',
      terserOptions: { compress: { drop_console: true, drop_debugger: true } },
    },
  },
  compressHTML: true,
  output: 'static',
});
