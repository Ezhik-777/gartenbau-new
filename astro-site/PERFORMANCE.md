# Performance Optimization Guide

## Overview

This document describes the performance optimizations implemented in v5.0 of the Gartenbau Z.M. website.

## Optimizations Implemented

### 1. Code Splitting

**Location:** `astro.config.mjs`

We implemented smart code splitting to reduce initial bundle size:

- **React vendor chunk**: React and React DOM are bundled separately
- **AOS vendor chunk**: Animation library is loaded separately
- **BeforeAfter slider chunk**: Heavy comparison slider component is split
- **Gallery chunk**: Gallery grid component gets its own chunk

This ensures that users only download what they need for each page.

### 2. CSS Optimization

**Location:** `postcss.config.cjs`

PostCSS with cssnano is configured to:
- Remove all comments
- Normalize whitespace
- Minify font values and gradients
- Merge longhand properties
- Merge duplicate rules

**Critical CSS Inlining:**

Critical CSS is inlined in `MainLayout.astro` for faster First Contentful Paint:
- CSS variables for colors and fonts
- Base reset styles
- Container styles

### 3. Image Optimization

**Features:**
- **Responsive images** with srcset (640w, 1024w, 1920w)
- **Lazy loading** with `loading="lazy"` attribute
- **WebP format** for all images (80-85% quality)
- **Blur-up placeholders** using data URLs
- **Optimized image component** (`OptimizedImage.astro`)

**Location:** `src/components/OptimizedImage.astro`

### 4. Font Optimization

**Location:** `MainLayout.astro`

- Preconnect to Google Fonts
- Font subsetting (latin only)
- Reduced font weights (removed 500 weight)
- `display=swap` for faster text rendering

### 5. Resource Preloading

Critical resources are preloaded:
- Hero image (`image_1.webp`)
- Font files (via preconnect)

### 6. JavaScript Minification

**Location:** `astro.config.mjs`

Terser is configured to:
- Drop console.log statements in production
- Drop debugger statements
- Compress code aggressively

### 7. Lazy Loading Components

React components use Astro's `client:visible` directive:
- `BeforeAfterSlider`: Only loads when visible
- `GalleryGrid`: Uses virtual scrolling
- `FloatingLeaves`: Decorative, loads when in viewport

## Performance Targets

### Lighthouse Scores

Target scores (out of 100):
- ✅ Performance: 95+
- ✅ Accessibility: 100
- ✅ Best Practices: 95+
- ✅ SEO: 100

### Bundle Size Limits

| Resource | Budget | Notes |
|----------|--------|-------|
| JavaScript | 60 KB | Total for initial load |
| CSS | 40 KB | Total for initial load |
| Images | 800 KB | First 15-20 images |
| Fonts | 100 KB | Google Fonts subset |

### Core Web Vitals

| Metric | Target | Good |
|--------|--------|------|
| LCP (Largest Contentful Paint) | <2.0s | <2.5s |
| FID (First Input Delay) | <100ms | <100ms |
| CLS (Cumulative Layout Shift) | <0.1 | <0.1 |
| FCP (First Contentful Paint) | <1.0s | <1.8s |
| TBT (Total Blocking Time) | <200ms | <300ms |

## Testing

### Run Performance Tests

```bash
# Build and analyze bundle
npm run build

# Run Lighthouse tests
npm run test:lighthouse

# Check bundle sizes
npm run test:performance
```

### Manual Testing

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Performance Budget

The `budget.json` file defines performance budgets that are checked during build.

## Best Practices

### When Adding New Features

1. **Check bundle impact**: Run `npm run test:performance` after adding dependencies
2. **Use code splitting**: Large components should be lazy-loaded
3. **Optimize images**: Always use WebP format with appropriate quality
4. **Test on 3G**: Use Chrome DevTools network throttling
5. **Check Lighthouse**: Aim for 95+ performance score

### Image Guidelines

- Use `OptimizedImage.astro` component for all images
- Maximum image size: 1920px width
- WebP quality: 80-85%
- Always provide width and height attributes
- Use `loading="lazy"` for below-fold images

### JavaScript Guidelines

- Minimize third-party scripts
- Use dynamic imports for non-critical code
- Avoid blocking the main thread
- Use Web Workers for heavy computations (if needed)

### CSS Guidelines

- Inline critical CSS
- Use CSS modules for component-specific styles
- Avoid @import in CSS (use build-time imports)
- Minimize animation complexity

## Monitoring

### Production Monitoring

1. **Google Analytics 4**: Track Core Web Vitals
2. **Google Search Console**: Monitor field data
3. **Lighthouse CI**: Automated testing on every deploy

### Metrics to Watch

- Bounce rate (should be <50%)
- Page load time (should be <3s)
- Time to Interactive (should be <3s)
- Mobile vs Desktop performance gap

## Troubleshooting

### Performance Issues

**Problem**: Lighthouse score drops below 90

**Solutions**:
1. Check for new heavy dependencies
2. Verify image optimization is working
3. Check for render-blocking resources
4. Review third-party scripts

**Problem**: Large bundle size

**Solutions**:
1. Run bundle analyzer
2. Check for duplicate dependencies
3. Ensure code splitting is working
4. Remove unused dependencies

**Problem**: Slow image loading

**Solutions**:
1. Verify WebP conversion is working
2. Check srcset generation
3. Ensure lazy loading is enabled
4. Review image compression quality

## Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
- [Astro Performance Guide](https://docs.astro.build/en/guides/performance/)
