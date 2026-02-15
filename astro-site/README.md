# 🚀 Gartenbau Z.M. - Astro v4.0

**Modern Zero-JS Static Site with Islands Architecture**

## 📊 Current Status

### ✅ Task 4.1: Setup Completed

**What's Done:**
- ✅ Astro 4.3.0 project initialized
- ✅ React integration configured
- ✅ TypeScript setup
- ✅ Global CSS with design tokens
- ✅ Base layout (MainLayout.astro)
- ✅ Test page (index.astro)
- ✅ Build working (dist/ 160KB)

**Bundle Size:**
- `dist/`: **160KB** (includes client.js 139KB + CSS 5KB + HTML 3.6KB)
- Static HTML: **3.6KB** (minified)
- CSS: **5KB**
- Client JS: **139KB** (React vendor for future islands)

**Note:** Client JS is currently loaded even though no islands are used yet. This will be optimized in Task 4.2 when we implement actual islands.

---

## 🛠️ Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run astro check
```

---

## 📁 Project Structure

```
astro-site/
├── public/
│   ├── img/               # Images (to be copied from main project)
│   ├── manifest.json      # PWA manifest
│   └── llm.txt            # AI policy
├── src/
│   ├── components/        # Astro & React components (empty - Task 4.2)
│   ├── layouts/
│   │   └── MainLayout.astro  # Base layout with SEO
│   ├── pages/
│   │   └── index.astro    # Homepage (test page)
│   └── styles/
│       └── global.css     # Global styles with design tokens
├── astro.config.mjs       # Astro configuration
├── package.json
└── tsconfig.json
```

---

## 🎨 Design System

Global CSS includes:
- **CSS Variables** - Colors, typography, spacing
- **Reset** - Modern CSS reset
- **Typography** - Heading styles, fluid typography
- **Utilities** - Container, buttons, sections
- **Responsive** - Mobile-first approach
- **Accessibility** - Focus styles, reduced motion

### Key Variables:
```css
--color-brand: #2d5a3d;
--font-sans: 'Inter', system-ui;
--space-4: 1rem;
--radius-lg: 0.75rem;
--transition-base: 300ms ease;
```

---

## 📦 Dependencies

### Production:
- `astro@^4.3.0` - Static site generator
- `@astrojs/react@^3.0.0` - React integration
- `react@^18.2.0` - For interactive islands
- `react-dom@^18.2.0`

### Development:
- `@astrojs/check@^0.4.0` - Type checking
- `typescript@^5.3.0` - TypeScript support

---

## 🎯 Next Steps (Task 4.2)

### Components to Migrate:
1. **Header.astro** - Static header (Zero JS)
2. **Footer.astro** - Static footer (Zero JS)
3. **HeroSlider.tsx** - React island (interactive)
4. **Gallery.astro** - Static grid
5. **GalleryItem.tsx** - React island (lazy load)
6. **ContactForm.astro** - Form with Formspree
7. **FAQAccordion.tsx** - React island (interactive)

### Expected Bundle After Task 4.2:
- Total: **~40-50KB** (vs current 160KB)
- HTML: **~15KB** (all pages)
- CSS: **~15KB** (global + components)
- JS islands: **~15-20KB** (slider + gallery + FAQ only)

---

## 🚀 Migration Plan

### Task 4.1: Setup ✅ (DONE)
- [x] Astro project init
- [x] Global CSS with design tokens
- [x] Base layout
- [x] Test page
- [x] Build verification

### Task 4.2: Components (Next - 8-10 hours)
- [ ] Header.astro (static)
- [ ] Footer.astro (static)
- [ ] HeroSlider.tsx (island)
- [ ] Gallery with virtual scrolling
- [ ] FAQ accordion
- [ ] Contact form
- [ ] Service cards

### Task 4.3: SEO Component (2-3 hours)
- [ ] Enhanced SEO.astro
- [ ] Schema.org integration
- [ ] Sitemap generation

### Task 4.4: View Transitions (1-2 hours)
- [ ] Astro View Transitions API
- [ ] Smooth page navigation

### Task 4.5: Build & Deploy (2-3 hours)
- [ ] Production optimization
- [ ] Performance audit
- [ ] Deployment setup

---

## 🎯 Goals

### Performance:
- **Bundle:** 73KB → 25KB (-66%)
- **Lighthouse:** 95-100 (all metrics)
- **FCP:** <1.2s
- **TTI:** <2.5s

### Architecture:
- **Zero JS by default** - Only critical HTML/CSS
- **Islands** - Interactive components (slider, gallery, FAQ)
- **Static** - Header, footer, content sections
- **Optimized** - Code splitting, lazy loading

---

## 📊 Comparison

| Metric | Current (Vanilla) | Astro Target | Improvement |
|--------|------------------|--------------|-------------|
| Bundle Size | 73 KB | 25 KB | **-66%** |
| JavaScript | 73 KB | 15-20 KB | **-73%** |
| Initial HTML | 1517 lines | ~15 KB | Optimized |
| Interactive | Full page | Islands only | Selective |
| Lighthouse | 90+ | 95-100 | +5-10 |

---

## 🔧 Development Notes

### Current Test Page:
- Simple hero section
- Contact section
- Zero interactivity (no islands yet)
- Demonstrates:
  - Global CSS variables
  - Responsive layout
  - SEO meta tags
  - PWA integration

### Known Issues:
- Client.js (139KB) loaded even without islands
  - This is normal for React integration
  - Will be optimized when islands are added
  - Only needed chunks will be loaded

---

## ✅ Task 4.1 Complete!

**Time:** ~3 hours (setup + testing)
**Status:** Ready for Task 4.2 (Components)

**What Works:**
- ✅ Dev server (`npm run dev`)
- ✅ Production build (`npm run build`)
- ✅ Type checking
- ✅ Global styles
- ✅ SEO meta tags
- ✅ PWA manifest
- ✅ llm.txt

**Next:** Migrate components from vanilla site to Astro + React islands

---

**Created:** Feb 15, 2026
**Author:** Claude Sonnet 4.5
**Project:** Gartenbau Z.M. v4.0 Modernization - Phase 4
