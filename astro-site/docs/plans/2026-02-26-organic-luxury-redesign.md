# Organic Luxury Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform gartenbauzm.de into a premium organic luxury brand experience — mobile-first, SEO-optimized, Lighthouse 98+.

**Architecture:** Astro 5 + Tailwind CSS 4, minimal React (gallery + before/after only). Content Collections for projects & blog. CSS-only animations replacing AOS. DM Serif Display + Outfit fonts. Deep forest/sand/terracotta palette.

**Tech Stack:** Astro 5.x, Tailwind CSS 4, React 18 (islands only), TypeScript 5, PostCSS

**Design doc:** `docs/plans/2026-02-26-organic-luxury-redesign-design.md`

---

## Task 1: Create worktree and upgrade foundation

**Files:**
- Modify: `package.json`
- Modify: `astro.config.mjs`
- Modify: `tsconfig.json`
- Modify: `postcss.config.cjs`
- Delete: `src/styles/design-system.css`
- Delete: `src/styles/components.css`
- Delete: `src/styles/animations.css`
- Delete: `src/styles/scroll-animations.css`

**Step 1: Create a new branch**

```bash
git checkout -b redesign-v6
```

**Step 2: Update package.json dependencies**

Replace the current dependencies with:

```json
{
  "dependencies": {
    "@astrojs/react": "^4.2.0",
    "@astrojs/sitemap": "^3.3.0",
    "@astrojs/tailwind": "^6.0.0",
    "astro": "^5.4.0",
    "react": "^18.3.1",
    "react-compare-slider": "^3.1.0",
    "react-dom": "^18.3.1",
    "sharp": "^0.34.5",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "typescript": "^5.7.0"
  }
}
```

Key changes:
- Astro 4.3 → 5.4 (Content Collections v3, better perf)
- Add Tailwind CSS 4 + @astrojs/tailwind
- Remove: `aos`, `@types/aos`, `cssnano`, `postcss`, `workbox-build`, `workbox-window`, `glob`
- Update @astrojs/react to v4 (required for Astro 5)

**Step 3: Install dependencies**

```bash
cd astro-site && npm install
```

Expected: Clean install, no peer dependency errors.

**Step 4: Create Tailwind CSS config**

Create `astro-site/src/styles/global.css` (replace existing):

```css
@import "tailwindcss";

/* ========== Organic Luxury Theme ========== */

@theme {
  /* Colors */
  --color-forest: #1a3a2a;
  --color-forest-light: #2d5a3f;
  --color-sand: #d4c5a9;
  --color-sand-light: #e8dcc8;
  --color-terracotta: #c17f59;
  --color-terracotta-dark: #a66b48;
  --color-ivory: #faf8f5;
  --color-ivory-warm: #f5f0e8;
  --color-text: #2a2a2a;
  --color-text-muted: #6b6b6b;

  /* Fonts */
  --font-heading: 'DM Serif Display', Georgia, serif;
  --font-body: 'Outfit', system-ui, sans-serif;

  /* Spacing extras */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}

/* ========== Base Styles ========== */

@layer base {
  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-body);
    color: var(--color-text);
    background-color: var(--color-ivory);
    line-height: 1.6;
  }

  h1, h2, h3, h4 {
    font-family: var(--font-heading);
    color: var(--color-forest);
    line-height: 1.15;
  }

  /* Smooth anchor scrolling with header offset */
  :target {
    scroll-margin-top: 100px;
  }

  /* Focus styles */
  :focus-visible {
    outline: 2px solid var(--color-terracotta);
    outline-offset: 2px;
  }

  /* Reduce motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

/* ========== Scroll Animations ========== */

@layer utilities {
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
  }

  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Grain texture overlay */
  .grain::after {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    z-index: 9999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
}
```

**Step 5: Update astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gartenbauzm.de',
  integrations: [
    react(),
    tailwind(),
    sitemap(),
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets',
  },
  vite: {
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
```

**Step 6: Delete old style files**

```bash
rm src/styles/design-system.css src/styles/components.css src/styles/animations.css src/styles/scroll-animations.css
```

Keep `src/styles/global.css` (rewritten in step 4).

**Step 7: Delete postcss.config.cjs** (Tailwind 4 handles this)

```bash
rm postcss.config.cjs
```

**Step 8: Verify build compiles**

```bash
npm run dev
```

Expected: Dev server starts (pages will be broken — that's fine, we just need the build chain working).

**Step 9: Commit**

```bash
git add -A && git commit -m "chore: upgrade to Astro 5 + Tailwind CSS 4, remove AOS"
```

---

## Task 2: MainLayout — new design shell

**Files:**
- Rewrite: `src/layouts/MainLayout.astro`

**Step 1: Rewrite MainLayout.astro**

```astro
---
import '../styles/global.css';
import SEO from '../components/SEO.astro';
import GoogleAnalytics from '../components/analytics/GoogleAnalytics.astro';
import { ViewTransitions } from 'astro:transitions';

interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
}

const { title, description, canonical, ogImage, ogType, noindex } = Astro.props;
---

<!DOCTYPE html>
<html lang="de" class="grain">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">

  <SEO
    title={title}
    description={description}
    canonical={canonical}
    ogImage={ogImage}
    ogType={ogType}
    noindex={noindex}
  />

  <!-- PWA -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#1a3a2a">
  <link rel="icon" type="image/webp" sizes="32x32" href="/img/logo.webp">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <GoogleAnalytics />
  <ViewTransitions />
</head>

<body class="font-body text-text bg-ivory antialiased">
  <slot />

  <!-- Scroll reveal observer -->
  <script>
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    function initReveal() {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    initReveal();
    document.addEventListener('astro:page-load', initReveal);
  </script>
</body>
</html>
```

Key changes:
- Removed AOS import and initialization
- Removed CSP header (causes issues with Tailwind)
- Replaced Plus Jakarta Sans + Inter with DM Serif Display + Outfit
- Added grain texture class
- Lightweight IntersectionObserver for scroll reveals
- Removed parallax JS fallback (CSS-only now)
- Theme color updated to forest green

**Step 2: Verify dev server still runs**

```bash
npm run dev
```

**Step 3: Commit**

```bash
git add src/layouts/MainLayout.astro && git commit -m "feat: rewrite MainLayout with organic luxury design shell"
```

---

## Task 3: Header — organic luxury navigation

**Files:**
- Rewrite: `src/components/Header.astro`

**Step 1: Rewrite Header.astro**

Complete rewrite with Tailwind classes. Mobile-first hamburger menu, sticky with backdrop blur, forest green theme. Logo left, nav center (desktop), CTA right.

Key design decisions:
- Sticky header with `bg-ivory/90 backdrop-blur-md` on scroll
- Logo: text-based "GARTENBAU Z.M." in DM Serif Display
- Desktop nav: horizontal links with terracotta hover underline
- Mobile: full-screen overlay with large links, forest green background
- Phone CTA button visible on desktop
- Hamburger icon animated to X on open
- All `data-aos` attributes replaced with `reveal` class
- No React, pure Astro + CSS transitions

Navigation items:
- Leistungen (anchor #leistungen)
- Projekte (/projekte)
- Galerie (/galerie)
- Über uns (anchor #ueber-uns)
- Blog (/blog)
- Kontakt (anchor #kontakt)

**Step 2: Test on mobile viewport (Chrome DevTools)**

Verify: hamburger works, menu opens/closes, links navigate correctly.

**Step 3: Test on desktop viewport**

Verify: horizontal nav, sticky scroll behavior, phone CTA visible.

**Step 4: Commit**

```bash
git add src/components/Header.astro && git commit -m "feat: organic luxury header with mobile-first nav"
```

---

## Task 4: Footer — warm, elegant footer

**Files:**
- Rewrite: `src/components/Footer.astro`

**Step 1: Rewrite Footer.astro**

Tailwind-based footer with forest green background, sand/ivory text:
- 4-column grid (mobile: stack): Services, Kontakt, Rechtliches, Öffnungszeiten
- Company tagline in DM Serif Display
- Social links (WhatsApp, Google Reviews)
- Back-to-top button with smooth scroll
- Copyright with current year
- Subtle top border with terracotta accent

**Step 2: Visual check at all breakpoints**

**Step 3: Commit**

```bash
git add src/components/Footer.astro && git commit -m "feat: organic luxury footer with warm forest theme"
```

---

## Task 5: Homepage hero — full-bleed static hero

**Files:**
- Create: `src/components/Hero.astro`
- Delete: `src/components/HeroSlider.tsx`

**Step 1: Create Hero.astro**

Full-viewport-height hero section:
- Background: `image_1.webp` with dark overlay gradient (`from-forest/70 to-transparent`)
- Content centered vertically
- DM Serif Display headline: "Ihr Garten. Unsere Leidenschaft."
- Outfit subtitle: "Professioneller Gartenbau in Stuttgart & Region seit über 10 Jahren"
- Single CTA button: "Kostenlose Beratung" → #kontakt (terracotta bg, rounded-full)
- Subtle scroll indicator at bottom (animated chevron)
- Image loaded with `fetchpriority="high"` for LCP
- CSS parallax effect: `background-attachment: fixed` on desktop, disabled on mobile

**Step 2: Delete HeroSlider.tsx**

```bash
rm src/components/HeroSlider.tsx
```

**Step 3: Visual check — hero fills viewport, text readable, CTA prominent**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: full-bleed static hero replacing React slider"
```

---

## Task 6: TrustBar + ServiceCard components

**Files:**
- Create: `src/components/TrustBar.astro`
- Rewrite: `src/components/ServiceCard.astro`

**Step 1: Create TrustBar.astro**

Horizontal bar below hero with 3 stats:
- "10+ Jahre Erfahrung"
- "180+ Projekte"
- "5.0 ★ Google Bewertung"

Styling: ivory-warm background, centered flex row (mobile: column), DM Serif for numbers, Outfit for labels. Subtle dividers between items on desktop.

**Step 2: Rewrite ServiceCard.astro**

New organic luxury card design:
- White background, subtle sand border on hover
- Icon area with forest-light circle background
- Title in DM Serif Display
- Description in Outfit (text-muted)
- Hover: subtle translateY(-4px) + shadow lift
- All Tailwind classes, no custom CSS

**Step 3: Visual check — trust bar readable, cards look premium**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: TrustBar and organic luxury ServiceCard"
```

---

## Task 7: FAQ — CSS-only accordion

**Files:**
- Create: `src/components/FAQ.astro`
- Keep: `src/components/FAQSchema.astro` (reuse for structured data)
- Delete: `src/components/FAQAccordion.tsx`

**Step 1: Create FAQ.astro**

CSS-only accordion using `<details>/<summary>`:
- Same 10 FAQ items from current FAQAccordion.tsx
- Smooth open/close animation with CSS `grid-template-rows: 0fr → 1fr` trick
- DM Serif Display for questions
- Outfit for answers
- Terracotta accent on open marker
- Sand-light background for each item
- Border-bottom separator between items
- Include FAQSchema for structured data

**Step 2: Delete FAQAccordion.tsx**

```bash
rm src/components/FAQAccordion.tsx
```

**Step 3: Test all 10 FAQ items open/close**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: CSS-only FAQ accordion replacing React component"
```

---

## Task 8: ContactForm — luxury redesign

**Files:**
- Rewrite: `src/components/ContactForm.astro`

**Step 1: Rewrite ContactForm.astro**

Keep Formspree integration and honeypot, restyle completely:
- Two-column layout (mobile: stack): form left, contact info right
- Floating labels with sand border, forest focus ring
- Terracotta submit button, full-width on mobile
- Contact info side: address, phone, email, opening hours
- WhatsApp CTA inline
- Success/error states with organic styling
- All Tailwind classes

**Step 2: Test form submission (Formspree test mode)**

**Step 3: Commit**

```bash
git add src/components/ContactForm.astro && git commit -m "feat: luxury-styled contact form"
```

---

## Task 9: ReviewsSection — Google Reviews

**Files:**
- Create: `src/components/ReviewsSection.astro`

**Step 1: Create ReviewsSection.astro**

Static reviews section (no API):
- Section heading: "Was unsere Kunden sagen"
- 3-4 review cards with: reviewer name, 5-star rating (SVG stars), review text, "vor X Monaten"
- Google Reviews badge/link at bottom
- Cards in responsive grid (1 col mobile, 3 col desktop)
- Review schema markup (AggregateRating)
- Subtle ivory-warm background

Use real-looking German review content about garden projects.

**Step 2: Verify schema markup with Rich Results Test mentally**

**Step 3: Commit**

```bash
git add src/components/ReviewsSection.astro && git commit -m "feat: Google Reviews section with schema markup"
```

---

## Task 10: WhatsApp floating button

**Files:**
- Create: `src/components/WhatsAppButton.astro`

**Step 1: Create WhatsAppButton.astro**

CSS-only floating button:
- Fixed bottom-right (bottom-6 right-6)
- Green circle (#25D366) with WhatsApp SVG icon
- Pulse animation on load (CSS keyframes, plays once)
- Tooltip on hover: "Schreiben Sie uns!"
- Links to `https://wa.me/4917XXXXXXXX?text=Hallo...` (use phone from existing ContactForm)
- `aria-label="WhatsApp Chat starten"`
- On mobile: slightly larger (56px), always visible
- On desktop: smaller (48px), bottom-right corner
- z-index above content, below mobile menu

**Step 2: Commit**

```bash
git add src/components/WhatsAppButton.astro && git commit -m "feat: WhatsApp floating CTA button"
```

---

## Task 11: Homepage assembly — index.astro complete rewrite

**Files:**
- Rewrite: `src/pages/index.astro`

**Step 1: Rewrite index.astro**

Assemble all components in the correct order:

```astro
---
import MainLayout from '../layouts/MainLayout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import TrustBar from '../components/TrustBar.astro';
import ServiceCard from '../components/ServiceCard.astro';
import ReviewsSection from '../components/ReviewsSection.astro';
import BeforeAfterSlider from '../components/gallery/BeforeAfterSlider';
import FAQ from '../components/FAQ.astro';
import ContactForm from '../components/ContactForm.astro';
import WhatsAppButton from '../components/WhatsAppButton.astro';
import Footer from '../components/Footer.astro';
---

<MainLayout
  title="Gartenbau Remseck | Landschaftsbau Stuttgart | Garten Ludwigsburg"
  description="Professioneller Gartenbau in Remseck, Stuttgart, Ludwigsburg & Waiblingen. Gartengestaltung, Terrassen, Natursteinarbeiten. Kostenlose Beratung."
>
  <Header />
  <Hero />
  <TrustBar />

  <!-- Leistungen -->
  <section id="leistungen" class="py-20 md:py-28 bg-ivory">
    <!-- Section header + 8 ServiceCards in 2-col grid -->
  </section>

  <!-- Projekte Preview -->
  <section class="py-20 md:py-28 bg-ivory-warm">
    <!-- "Unsere Projekte" heading + 3 featured ProjectCards + CTA to /projekte -->
  </section>

  <!-- Before/After -->
  <section class="py-20 md:py-28 bg-ivory">
    <!-- "Vorher & Nachher" heading + 2-3 BeforeAfterSlider components -->
  </section>

  <!-- Reviews -->
  <ReviewsSection />

  <!-- Über Uns -->
  <section id="ueber-uns" class="py-20 md:py-28 bg-ivory">
    <!-- Photo + company story text, 2-column layout -->
  </section>

  <!-- FAQ -->
  <section id="faq" class="py-20 md:py-28 bg-ivory-warm">
    <FAQ />
  </section>

  <!-- Kontakt -->
  <section id="kontakt" class="py-20 md:py-28 bg-ivory">
    <ContactForm />
  </section>

  <Footer />
  <WhatsAppButton />
</MainLayout>
```

Sections use alternating `bg-ivory` and `bg-ivory-warm` backgrounds. All section headings use DM Serif Display. Section subtitles use Outfit in text-muted. Generous vertical padding (py-20 to py-28). Content wrapped in `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`. All items use `reveal` class for scroll animations.

**Step 2: Remove old decorative component imports**

Delete references to BackgroundPattern, FloatingLeaves.

**Step 3: Full scroll-through test at mobile and desktop**

**Step 4: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat: complete homepage assembly with organic luxury design"
```

---

## Task 12: Remove deprecated components

**Files:**
- Delete: `src/components/decorations/FloatingLeaves.tsx`
- Delete: `src/components/decorations/LeafSVG.astro`
- Delete: `src/components/decorations/BackgroundPattern.astro`
- Delete: `src/components/OptimizedImage.astro` (if unused after hero change)

**Step 1: Delete files**

```bash
rm -rf src/components/decorations/
rm src/components/OptimizedImage.astro
```

**Step 2: Verify no imports reference deleted files**

```bash
grep -r "FloatingLeaves\|LeafSVG\|BackgroundPattern\|OptimizedImage" src/
```

Expected: no results.

**Step 3: Commit**

```bash
git add -A && git commit -m "chore: remove deprecated decorative components"
```

---

## Task 13: Content Collections — projects

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/gartengestaltung-remseck.md`
- Create: `src/content/projects/naturstein-terrasse-ludwigsburg.md`
- Create: `src/content/projects/pflasterarbeiten-waiblingen.md`
- Create: `src/content/projects/sichtschutz-fellbach.md`
- Create: `src/content/projects/terrassenbau-stuttgart.md`

**Step 1: Create content config**

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['gartengestaltung', 'naturstein', 'terrasse', 'pflaster', 'sichtschutz']),
    date: z.coerce.date(),
    heroImage: z.string(),
    images: z.array(z.string()),
    beforeAfter: z.array(z.object({
      before: z.string(),
      after: z.string(),
    })).optional(),
    featured: z.boolean().default(false),
    location: z.string(),
    duration: z.string().optional(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, blog };
```

**Step 2: Create 5 project markdown files**

Each file: frontmatter with schema fields + 2-3 paragraphs of German content describing the project (challenge, solution, result). Use existing images from `/img/image_N.webp`. Mark 3 as `featured: true`.

**Step 3: Verify content collections load**

```bash
npm run dev
```

Check console for any schema validation errors.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: content collections for projects with 5 entries"
```

---

## Task 14: Projects pages — listing + detail

**Files:**
- Create: `src/components/ProjectCard.astro`
- Create: `src/pages/projekte/index.astro`
- Create: `src/pages/projekte/[...slug].astro`

**Step 1: Create ProjectCard.astro**

Card component:
- Hero image with aspect-ratio: 4/3, object-cover
- Category badge (top-left overlay, forest bg, white text, small)
- Title in DM Serif Display
- Location + date in text-muted
- Short description
- Hover: image scale 1.02, shadow lift
- Link wraps entire card

**Step 2: Create projects listing page**

`/projekte` page with:
- Header + hero banner (smaller than homepage hero)
- Breadcrumbs
- Category filter buttons
- Grid of ProjectCards (2 col on tablet, 3 on desktop)
- All projects from Content Collection, sorted by date desc

**Step 3: Create project detail page**

`/projekte/[...slug]` with:
- Full-width hero image
- Breadcrumbs
- Title, category, location, duration
- Markdown content (challenge/solution/result)
- Before/after slider if available
- Image gallery grid
- "Weitere Projekte" section with 3 related cards

**Step 4: Test navigation: listing → detail → back**

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: projects listing and detail pages with content collections"
```

---

## Task 15: Blog pages — listing + detail

**Files:**
- Create: `src/content/blog/garten-winterfest-machen.md`
- Create: `src/content/blog/naturstein-vs-betonstein.md`
- Create: `src/content/blog/terrassenplanung-tipps.md`
- Create: `src/components/BlogCard.astro`
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`

**Step 1: Create 3 blog articles**

German-language gardening articles with SEO-friendly content. Each 300-500 words. Include relevant tags and hero images from existing pool.

**Step 2: Create BlogCard.astro**

Similar to ProjectCard but with date, reading time estimate, tags displayed.

**Step 3: Create blog listing page**

`/blog` page with:
- Hero banner
- Breadcrumbs
- Grid of BlogCards (1 col mobile, 2 col tablet, 3 col desktop)
- Sorted by date desc

**Step 4: Create blog post layout**

`/blog/[...slug]` with:
- Article layout with max-w-3xl for readability
- Hero image
- Title, date, reading time, tags
- Prose typography (Tailwind prose plugin or custom)
- "Weitere Artikel" section
- Schema.org BlogPosting markup

**Step 5: Test all 3 articles render correctly**

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: blog listing and detail pages with 3 articles"
```

---

## Task 16: Gallery page — restyle

**Files:**
- Rewrite: `src/pages/gallery.astro`
- Modify: `src/components/Gallery.astro` (update styling)
- Modify: `src/components/GalleryGrid.tsx` (update Tailwind classes in inline styles)

**Step 1: Restyle gallery page**

- New hero banner matching organic luxury aesthetic
- Breadcrumbs
- Category filter buttons restyled (forest bg active, sand-light inactive)
- Gallery wrapper with ivory background
- Keep GalleryGrid React component (masonry + lightbox), update its container styling

**Step 2: Update GalleryGrid.tsx inline styles**

The React component uses inline styles for the masonry layout. Update color references to match new palette. Keep functional logic unchanged.

**Step 3: Test filters, lightbox, navigation**

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: restyle gallery page with organic luxury theme"
```

---

## Task 17: Legal pages — restyle impressum + datenschutz

**Files:**
- Rewrite: `src/pages/impressum.astro`
- Rewrite: `src/pages/datenschutz.astro`

**Step 1: Restyle both legal pages**

- Clean prose layout with max-w-3xl
- Breadcrumbs
- DM Serif Display headings
- Outfit body text
- Keep all legal content identical
- Ivory background, forest headings

**Step 2: Commit**

```bash
git add src/pages/impressum.astro src/pages/datenschutz.astro && git commit -m "feat: restyle legal pages with organic luxury theme"
```

---

## Task 18: SEO enhancements

**Files:**
- Modify: `src/components/SEO.astro`
- Create: `public/llm.txt`
- Create: `public/humans.txt`
- Modify: `public/robots.txt`
- Modify: `public/manifest.json`

**Step 1: Update SEO.astro**

Add support for:
- Article schema (for blog posts)
- ImageGallery schema (for gallery page)
- BlogPosting schema (for blog detail)
- Enhanced breadcrumbs for new pages

**Step 2: Create llm.txt**

```
# Gartenbau Z.M.
> Professioneller Gartenbau und Landschaftsbau in Stuttgart und Region

## Über uns
Gartenbau Z.M. ist ein Gartenbau- und Landschaftsbauunternehmen mit Sitz in Remseck am Neckar.
Wir bedienen die Region Stuttgart, Ludwigsburg, Waiblingen und Fellbach.
Seit über 10 Jahren gestalten wir Gärten, Terrassen und Außenanlagen.

## Leistungen
- Gartengestaltung und Gartenplanung
- Natursteinarbeiten (Mauern, Treppen, Einfassungen)
- Terrassenbau
- Pflasterarbeiten (Einfahrten, Wege, Parkplätze)
- Landschaftsbau und Erdarbeiten
- Rollrasen-Verlegung
- Sichtschutz und Zäune
- Hausmeisterservice und Gartenpflege

## Kontakt
- Adresse: Remseck am Neckar, Baden-Württemberg
- Telefon: [phone]
- E-Mail: [email]
- Website: https://gartenbauzm.de

## Bewertungen
5.0 Sterne auf Google (47+ Bewertungen)
```

**Step 3: Create humans.txt**

```
/* TEAM */
Gartenbau Z.M.
Site: gartenbauzm.de
Location: Remseck am Neckar, Germany

/* SITE */
Built with: Astro, Tailwind CSS
Last update: 2026-02-26
Language: German
```

**Step 4: Update robots.txt**

Add reference to llm.txt and humans.txt:

```
User-agent: *
Allow: /

Sitemap: https://gartenbauzm.de/sitemap-index.xml

# LLM Crawlers
User-agent: GPTBot
Allow: /llm.txt

User-agent: ChatGPT-User
Allow: /llm.txt

User-agent: Claude-Web
Allow: /llm.txt
```

**Step 5: Update manifest.json theme color**

Change theme_color from `#459d72` to `#1a3a2a`.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: enhanced SEO, llm.txt, humans.txt"
```

---

## Task 19: Service Worker update

**Files:**
- Modify: `scripts/build-sw.js` (if kept)
- Modify: `src/components/ServiceWorkerRegistration.astro`

**Step 1: Decide on service worker**

The current workbox-based service worker was removed from dependencies in Task 1. Options:
- Keep a simple hand-written service worker in `public/service-worker.js`
- Remove service worker entirely

Recommendation: Keep a minimal service worker for offline support. Update `public/service-worker.js` to a simple cache-first strategy without workbox.

**Step 2: Update ServiceWorkerRegistration.astro**

Keep the registration script, simplify to just register the SW.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: simplified service worker without workbox"
```

---

## Task 20: Final integration test + performance audit

**Files:**
- Modify: `package.json` (update build script)

**Step 1: Update build script in package.json**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  }
}
```

**Step 2: Full build**

```bash
npm run build
```

Expected: Clean build, no errors.

**Step 3: Preview and full manual test**

```bash
npm run preview
```

Test checklist:
- [ ] Homepage loads, hero visible, all sections scroll
- [ ] Mobile menu opens/closes
- [ ] All anchor links work (#leistungen, #kontakt, etc.)
- [ ] /projekte listing loads, filter works
- [ ] /projekte/[slug] detail page renders
- [ ] /blog listing loads
- [ ] /blog/[slug] article renders
- [ ] /galerie gallery loads, lightbox works
- [ ] Before/after sliders functional
- [ ] Contact form submits
- [ ] WhatsApp button visible and links correctly
- [ ] Footer links all work
- [ ] /impressum and /datenschutz render
- [ ] /llm.txt accessible
- [ ] /humans.txt accessible
- [ ] View Transitions work between pages
- [ ] Mobile: everything touch-friendly, no overflow
- [ ] Desktop: all layouts correct, no broken grids

**Step 4: Lighthouse audit**

```bash
npx lighthouse https://localhost:4321 --output=json --chrome-flags="--headless"
```

Target: Performance 98+, SEO 100, Accessibility 100, Best Practices 95+.

**Step 5: Fix any issues found**

**Step 6: Final commit**

```bash
git add -A && git commit -m "feat: final integration, performance optimizations"
```
