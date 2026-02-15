# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is a modern website for Gartenbau Z.M., a German landscaping company in Remseck am Neckar. The site uses Astro 4.3.0 with Islands Architecture for optimal performance.

### Structure
- **Astro SSG site** with German content focused on local SEO
- **Multi-page layout**: `astro-site/src/pages/` (index, gallery, impressum, datenschutz, before-after-demo)
- **Islands Architecture**: React components hydrated client-side only where needed
- **Asset organization**: `astro-site/public/` for static assets, `astro-site/src/` for components
- **Deployment**: Production domain (gartenbauzm.de)

### Key Features
- Comprehensive local SEO with Schema.org structured data (LocalBusiness + LandscapingBusiness)
- Modern gallery with masonry layout (180+ optimized images)
- Before/After image sliders using react-compare-slider
- Contact form with Formspree integration (action="https://formspree.io/f/xoqznyqb")
- Mobile-responsive design with parallax effects using AOS and CSS scroll-driven animations
- Google Analytics 4 integration with event tracking
- WhatsApp integration for direct contact
- PWA Service Worker v5.0 with Workbox for smart caching
- Astro View Transitions for smooth page navigation

### Dependencies

**Core:**
- Astro 4.3.0 (SSG framework)
- React 18.2.0 (Islands only - BeforeAfterSlider, GalleryGrid, FloatingLeaves, FAQAccordion, HeroSlider)
- TypeScript 5.3.0

**Animation & UX:**
- AOS 2.3.4 (Animate On Scroll)
- react-compare-slider 3.1.0 (Before/After comparisons)

**Build Tools:**
- Sharp 0.34.5 (Image optimization)
- Workbox 7.4.0 (Service Worker generation)
- PostCSS + cssnano (CSS optimization)

### Image Processing

Located at `astro-site/scripts/optimize-images.js`:
- **Sharp.js** script for generating responsive image variants
- Creates 3 sizes: sm (640px), md (1024px), lg (1920px)
- WebP quality: 80% (sm), 85% (md/lg)
- Output: `astro-site/public/img/optimized/`
- Run with: `cd astro-site && npm run optimize-images`

### Build Process

```bash
# Development
npm run dev            # Development server at localhost:4321

# Production Build
npm run optimize-images  # Generate responsive images (first time only)
npm run build           # Full build: optimize → check → build → sw → test
npm run build:quick     # Skip image optimization
npm run preview         # Preview production build

# Testing
npm run test:images      # Test image optimization
npm run test:performance # Check performance budgets
```

### Environment Variables

Create `.env` file in `astro-site/` directory:

```bash
# Google Analytics 4 (optional, production only)
PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Contact Information
- Phone: +49 178 2747470 (WhatsApp enabled)
- Email: info.gartenbauzm@gmx.de
- Address: Lerchenrain 9, 71686 Remseck am Neckar
- Service area: Stuttgart region, Rems-Murr-Kreis

### Development Notes
- Site content is in German - maintain language consistency
- Local SEO is critical - preserve location keywords and Schema.org data
- Image optimization runs as part of build - 268 variants generated from 181 sources
- Form submissions go to Formspree - test contact form after changes
- Google review integration link: https://g.page/r/CZk_BZnPcSqHEB0/review
- GA4 only loads in production (requires PUBLIC_GA_MEASUREMENT_ID env var)
- Service Worker v5.0 uses Workbox - caches HTML (24h), CSS/JS (7d), images (30d), fonts (1y)
- React components use client:load or client:visible directives for hydration control
- Security headers (CSP, X-Content-Type-Options) are set in MainLayout.astro

### Critical Functionality (DO NOT CHANGE)
- **Formspree**: `https://formspree.io/f/xoqznyqb` (contact form endpoint)
- **WhatsApp**: +49 178 2747470
- **Google Review**: https://g.page/r/CZk_BZnPcSqHEB0/review
- **Schema.org**: LocalBusiness + LandscapingBusiness (47 reviews, 5.0★)
