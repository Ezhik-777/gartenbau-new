# Organic Luxury Redesign — Design Document

**Date:** 2026-02-26
**Branch:** redesign-v6 (from redesign-v5)
**Status:** Approved

## Goal

Transform gartenbauzm.de from a clean-but-generic gardening site into a premium, memorable organic luxury brand experience. Mobile-first, SEO-optimized, performance-focused.

## Visual Direction: Organic Luxury

### Typography
- **Headings:** DM Serif Display — elegant serif with character
- **Body:** Outfit — clean geometric sans-serif, excellent readability
- **Source:** Google Fonts with preconnect + font-display: swap

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--forest` | `#1a3a2a` | Primary dark, nav, footer, headings |
| `--forest-light` | `#2d5a3f` | Hover states, secondary elements |
| `--sand` | `#d4c5a9` | Warm accent, borders, subtle backgrounds |
| `--sand-light` | `#e8dcc8` | Light accent backgrounds |
| `--terracotta` | `#c17f59` | CTA buttons, links, highlights |
| `--terracotta-dark` | `#a66b48` | CTA hover |
| `--ivory` | `#faf8f5` | Page background |
| `--ivory-warm` | `#f5f0e8` | Section alternate background |
| `--text` | `#2a2a2a` | Body text |
| `--text-muted` | `#6b6b6b` | Secondary text |
| `--white` | `#ffffff` | Cards, overlays |

### Textures & Effects
- Subtle grain overlay (CSS noise filter, no image)
- Organic rounded shapes for section dividers
- Soft shadows (no hard box-shadows)
- Parallax on hero image (CSS scroll-driven)

## Architecture

### Tech Stack Changes
| Current | New | Reason |
|---------|-----|--------|
| Astro 4.3 | Astro 5.x | Content Collections v3, better perf |
| Pure CSS + design-system.css | Tailwind CSS 4 | Mobile-first utilities, smaller output |
| React for HeroSlider, FAQ, Gallery, FloatingLeaves | React only for GalleryGrid + BeforeAfterSlider | Less JS, better LCP |
| AOS library (14KB) | Native CSS scroll animations + IntersectionObserver | Zero-dependency animations |
| No content collections | Content Collections for projects + blog | Scalable content |

### React Usage (Minimal)
Keep React only for:
- `GalleryGrid.tsx` — masonry layout + lightbox (complex DOM manipulation)
- `BeforeAfterSlider.tsx` — react-compare-slider dependency

Replace with Astro/CSS:
- HeroSlider → Static full-bleed hero (Astro component)
- FAQAccordion → CSS-only `<details>/<summary>` with animations
- FloatingLeaves → Remove (doesn't fit organic luxury aesthetic)

## Pages & Routes

### Homepage `/`
Sections in order:
1. **Hero** — Full-bleed photo, DM Serif headline, single CTA
2. **Trust bar** — "10+ Jahre · 180+ Projekte · 5.0★ Google"
3. **Services** — 2-column grid (mobile: stack), 6-8 cards with icons
4. **Featured Projects** — 3 project cards from Content Collection
5. **Before/After** — 2-3 transformation sliders
6. **Testimonials** — Google Reviews carousel/grid
7. **About** — Photo + text, company story
8. **FAQ** — CSS-only accordion with schema markup
9. **Contact** — Form + map/address + WhatsApp CTA

### Gallery `/galerie`
- Masonry grid, category filters
- Lightbox with navigation
- 180 existing images, categorized

### Projects `/projekte`
- Content Collection grid
- Each card: hero image, title, category, short description
- Filter by category

### Project Detail `/projekte/[slug]`
- Hero image full-width
- Description, challenge, solution
- Before/after slider
- Photo gallery
- Related projects

### Blog `/blog`
- Content Collection grid
- Article cards with image, title, date, excerpt
- Categories/tags

### Blog Post `/blog/[slug]`
- Article layout with table of contents
- Rich typography
- Related articles

### Legal Pages
- `/impressum` — restyled in new design
- `/datenschutz` — restyled in new design

### Machine-Readable
- `/llm.txt` — Business info, services, contact for LLM crawlers
- `/humans.txt` — Team credits

## SEO Strategy

### Structured Data (JSON-LD)
- **Every page:** Organization, BreadcrumbList
- **Homepage:** LocalBusiness (with geo, hours, reviews)
- **Homepage:** FAQPage
- **Gallery:** ImageGallery
- **Projects:** Article + ImageGallery
- **Blog:** Article, BlogPosting

### Meta Tags
- Unique title + description per page
- Open Graph (og:image from page hero)
- Twitter Cards
- Canonical URLs
- hreflang (de)
- Geo meta tags (Remseck am Neckar)

### Performance Targets
- Lighthouse Performance: 98+
- Lighthouse SEO: 100
- Lighthouse Accessibility: 100
- LCP < 1.5s
- CLS < 0.05
- FID < 50ms

### Content SEO
- Blog articles targeting local gardening keywords
- Project pages with rich descriptions
- Internal linking between related content
- Auto-generated sitemap via @astrojs/sitemap

## Features

### WhatsApp Floating Button
- Fixed bottom-right, CSS-only
- Pulse animation on first visit
- Links to wa.me with pre-filled message
- Hidden on desktop (or smaller, corner)

### Google Reviews Section
- Static review cards (no API dependency)
- 5-star rating display
- Review schema markup
- Link to Google Maps for more reviews

### Scroll Animations
- CSS `animation-timeline: scroll()` for parallax
- IntersectionObserver for fade-in reveals
- No external library dependency
- `prefers-reduced-motion` respected

### View Transitions
- Astro View Transitions API
- Smooth page-to-page navigation
- Shared element transitions (project cards → detail page)

## Mobile-First Approach

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Mobile Specifics
- Hamburger menu with full-screen overlay
- Touch-friendly tap targets (48px minimum)
- Swipeable gallery
- Sticky CTA on mobile (phone/WhatsApp)
- Optimized images per viewport (srcset)

## Content Collections Schema

### Projects (`src/content/projects/`)
```typescript
{
  title: string
  description: string
  category: 'gartengestaltung' | 'naturstein' | 'terrasse' | 'pflaster' | 'sichtschutz'
  date: Date
  heroImage: string
  images: string[]
  beforeAfter?: { before: string, after: string }[]
  featured: boolean
}
```

### Blog (`src/content/blog/`)
```typescript
{
  title: string
  description: string
  date: Date
  heroImage: string
  tags: string[]
  draft: boolean
}
```

## Files to Create/Modify

### New Files
- `src/content/config.ts` — Content Collections schema
- `src/content/projects/*.md` — Project entries (start with 3-5)
- `src/content/blog/*.md` — Blog articles (start with 2-3)
- `src/pages/projekte/index.astro` — Projects listing
- `src/pages/projekte/[...slug].astro` — Project detail
- `src/pages/blog/index.astro` — Blog listing
- `src/pages/blog/[...slug].astro` — Blog post
- `src/components/WhatsAppButton.astro` — Floating CTA
- `src/components/ReviewsSection.astro` — Google Reviews
- `src/components/TrustBar.astro` — Stats bar
- `src/components/ProjectCard.astro` — Project card
- `src/components/BlogCard.astro` — Blog card
- `public/llm.txt` — LLM crawler info
- `public/humans.txt` — Credits

### Major Rewrites
- `src/layouts/MainLayout.astro` — New design system, fonts, Tailwind
- `src/pages/index.astro` — Complete redesign
- `src/pages/gallery.astro` — New styling
- `src/components/Header.astro` — New nav design
- `src/components/Footer.astro` — New footer design
- `src/components/ServiceCard.astro` — New card design
- `src/components/ContactForm.astro` — New form design
- `src/components/SEO.astro` — Enhanced structured data
- `src/styles/` — Replace with Tailwind config

### Files to Remove
- `src/components/HeroSlider.tsx` — Replaced by static hero
- `src/components/FAQAccordion.tsx` — Replaced by CSS-only
- `src/components/decorations/FloatingLeaves.tsx` — Doesn't fit aesthetic
- `src/components/decorations/LeafSVG.astro` — Doesn't fit aesthetic
- `src/components/decorations/BackgroundPattern.astro` — Replaced by Tailwind
- `src/styles/design-system.css` — Replaced by Tailwind
- `src/styles/components.css` — Replaced by Tailwind
- `src/styles/animations.css` — Replaced by custom CSS
- `src/styles/scroll-animations.css` — Consolidated

### Config Changes
- `package.json` — Update Astro 5, add Tailwind 4, remove AOS
- `astro.config.mjs` — Add Tailwind integration, content collections
- `tailwind.config.ts` — New file with organic luxury theme
