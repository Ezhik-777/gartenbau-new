# 🌿 Gartenbau Z.M. - Astro v5.0

**Modern Green-Themed Website with Parallax Effects & Islands Architecture**

## 📊 Project Status - v5.0 (Feb 15, 2026)

✅ Complete Redesign:
- Modern clean design with nature green theme
- Parallax scroll effects (AOS + CSS)
- Before/After image sliders
- Masonry gallery (180+ images)
- Google Analytics 4
- Service Worker v5.0 (Workbox)
- Sharp image optimization

Lighthouse: Performance 92/100, Accessibility 100/100, SEO 100/100

## 🚀 Quick Start

```bash
npm install
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview build
```

## 📁 Key Files

- `src/pages/index.astro` - Homepage
- `src/pages/gallery.astro` - Full gallery (180 images)
- `src/components/gallery/BeforeAfterSlider.tsx` - Compare slider
- `src/styles/design-system.css` - Colors, typography, spacing
- `scripts/optimize-images.js` - Image optimization
- `REDESIGN-V5-CHANGELOG.md` - Full release notes

## 🎨 Design System

**Colors:**
- Primary: #22c55e (green-500)
- Secondary: #f97316 (terracotta)
- Accent: #8b5cf6 (purple)

**Typography:**
- Headings: Plus Jakarta Sans / Inter
- Body: Inter

## 📦 Bundle Size

- JavaScript: 207 KB (React 145 KB + islands 62 KB)
- CSS: 119 KB (AOS 25 KB + design system 94 KB)
- Images: 137 MB (lazy-loaded, cached)

## 🛠️ Build Commands

```bash
npm run optimize-images  # First time setup
npm run build           # Full production build
npm run test           # Run tests
```

## 📚 Documentation

See REDESIGN-V5-CHANGELOG.md for complete v5.0 release notes.

---

**Version:** 5.0.0 | **Status:** ✅ Production Ready
