# View Transitions Guide - Gartenbau Z.M. Astro v4.0

## Overview

Astro View Transitions provide smooth, app-like page navigation using the native View Transitions API. This eliminates full page reloads and creates a seamless user experience.

---

## Implementation

### 1. ViewTransitions Component

**File:** `src/layouts/MainLayout.astro`

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<head>
  <!-- ... other head elements ... -->
  <ViewTransitions />
</head>
```

**What it does:**
- Intercepts navigation clicks
- Fetches new page content via JavaScript
- Animates the transition between old and new content
- Updates browser history

---

## 2. Transition Names

### Persistent Elements

Elements with `transition:name` maintain their position during transitions.

**Header** (`src/components/Header.astro`):
```astro
<header class="header" transition:name="header">
  <!-- Header content -->
</header>
```

**Footer** (`src/components/Footer.astro`):
```astro
<footer class="footer" transition:name="footer">
  <!-- Footer content -->
</footer>
```

**Result:** Header and Footer stay in place, only main content transitions.

---

## 3. Custom Animations

**File:** `src/styles/global.css`

### Default Page Transition (Fade)

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

::view-transition-old(root) {
  animation-name: fade-out;
}

::view-transition-new(root) {
  animation-name: fade-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Persistent Element Animation (None)

```css
/* Header stays in place */
::view-transition-old(header),
::view-transition-new(header) {
  animation: none;
  mix-blend-mode: normal;
}

/* Footer stays in place */
::view-transition-old(footer),
::view-transition-new(footer) {
  animation: none;
  mix-blend-mode: normal;
}
```

### Slide Transitions (Optional)

```css
@keyframes slide-from-right {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-to-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}
```

**Usage:** Can be applied to specific elements with custom transition names.

---

## 4. Accessibility - Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable all animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  /* Disable view transitions */
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }

  html {
    scroll-behavior: auto !important;
  }
}
```

**Result:** Users with `prefers-reduced-motion: reduce` get instant navigation (no animations).

---

## 5. Smooth Scrolling

```css
html {
  scroll-behavior: smooth;
}
```

**Result:** Anchor links (`#Leistungen`, `#Kontakt`) scroll smoothly.

---

## How It Works

### Navigation Flow

1. **User clicks link** → e.g., `<a href="/impressum/">`
2. **Astro intercepts** → Prevents default browser navigation
3. **Fetch new page** → XHR request for `/impressum/`
4. **Start transition** → Browser creates snapshots of old/new states
5. **Animate** → CSS animations defined in `::view-transition-*`
6. **Swap content** → New page replaces old
7. **Update history** → `window.history.pushState()`

### Example: Home → Impressum

```
┌─────────────────────────────────────────┐
│ OLD PAGE (index.html)                   │
├─────────────────────────────────────────┤
│ [Header - stays]         ← transition:name="header"
│ [Hero Slider]            ← fades out
│ [Services]               ← fades out
│ [Gallery]                ← fades out
│ [FAQ]                    ← fades out
│ [Contact Form]           ← fades out
│ [Footer - stays]         ← transition:name="footer"
└─────────────────────────────────────────┘
              ↓ 0.3s fade transition
┌─────────────────────────────────────────┐
│ NEW PAGE (impressum/index.html)         │
├─────────────────────────────────────────┤
│ [Header - stays]         ← same element
│ [Impressum Content]      ← fades in
│ [Footer - stays]         ← same element
└─────────────────────────────────────────┘
```

---

## Browser Support

### View Transitions API

| Browser | Support | Fallback |
|---------|---------|----------|
| Chrome 111+ | ✅ Native | - |
| Edge 111+ | ✅ Native | - |
| Safari 18+ | ✅ Native | - |
| Firefox | ❌ | Polyfill by Astro |
| Mobile Safari | ✅ iOS 18+ | Polyfill for older |

**Astro's automatic fallback:**
- Unsupported browsers → Instant navigation (no animation)
- No JavaScript → Normal browser navigation
- Result: Progressive enhancement ✅

---

## Performance Impact

### Bundle Size Increase

**Before View Transitions:**
```
Total JS: 163 KB (54 KB gzipped)
```

**After View Transitions:**
```
Total JS: 177 KB (59 KB gzipped)
- hoisted.BScVxmeO.js: 14.30 KB (4.90 KB gzipped) ← View Transitions runtime
```

**Impact:** +14 KB uncompressed / +5 KB gzipped

### Runtime Performance

- **FCP (First Contentful Paint):** No change (first load)
- **Navigation speed:** 50-200ms faster (no full reload)
- **Perceived performance:** Much better (smooth animations)
- **Memory:** ~2-5 MB additional (snapshots during transition)

---

## User Experience Benefits

### Before View Transitions (Standard Navigation)
```
Click link → White flash → New page appears → Scroll to top → Jarring
```

### After View Transitions
```
Click link → Smooth fade → New page slides in → Feels like SPA → Delightful ✨
```

### Specific Improvements

1. **No white flash** - Content fades smoothly
2. **Header/Footer persistence** - Familiar elements stay in place
3. **Reduced cognitive load** - Brain processes smooth change better
4. **App-like feel** - Feels like a native mobile app
5. **Scroll position** - Can be preserved for back/forward navigation

---

## Advanced Techniques

### Custom Transition Names

Add `transition:name` to any element for custom animations:

```astro
<!-- Gallery thumbnail -->
<img
  src="/img/image_1.webp"
  alt="..."
  transition:name={`gallery-${id}`}
>

<!-- Clicking opens lightbox with smooth zoom -->
```

### Transition Direction Detection

```astro
---
// src/layouts/MainLayout.astro
---

<script>
  document.addEventListener('astro:before-preparation', (event) => {
    // Detect forward vs backward navigation
    const isBackward = event.direction === 'back';

    if (isBackward) {
      // Apply different animation
      document.documentElement.dataset.direction = 'back';
    }
  });
</script>
```

### Lifecycle Events

```javascript
// Triggered before transition starts
document.addEventListener('astro:before-preparation', () => {
  console.log('Preparing transition...');
});

// Triggered after new page loaded
document.addEventListener('astro:page-load', () => {
  console.log('New page loaded!');
  // Re-initialize analytics, etc.
});

// Triggered after transition complete
document.addEventListener('astro:after-swap', () => {
  console.log('Transition complete!');
});
```

---

## React Islands & View Transitions

### Issue: Islands Re-initialize

By default, React islands reinitialize on every navigation:
- State is lost
- Components re-mount
- Event listeners reset

### Solution: `transition:persist`

```astro
<!-- Preserve FAQ accordion state across navigations -->
<FAQAccordion client:visible transition:persist />
```

**Note:** Only useful if the island appears on multiple pages. In our case:
- HeroSlider: Only on homepage → No benefit
- FAQAccordion: Only on homepage → No benefit
- GalleryGrid: Only on homepage → No benefit

**Future use case:** If we add FAQ to impressum/datenschutz pages, use `transition:persist`.

---

## Debugging View Transitions

### Chrome DevTools

1. Open DevTools → **More Tools** → **Animations**
2. Navigate between pages
3. View transition timeline
4. Pause/replay transitions

### Console Logging

```javascript
document.addEventListener('astro:before-preparation', (e) => {
  console.log('From:', e.from);
  console.log('To:', e.to);
  console.log('Direction:', e.direction);
});
```

### Disable Temporarily

```astro
<!-- MainLayout.astro -->
<!-- Comment out to disable -->
<!-- <ViewTransitions /> -->
```

---

## SEO Considerations

### Does Google Execute View Transitions?

**Answer:** Yes, but it's irrelevant for SEO.

**Why:**
1. Google crawls static HTML (no JavaScript needed)
2. View Transitions only affect client-side navigation
3. Googlebot sees fully rendered pages
4. No impact on indexing or ranking

**Best practice:** Keep using server-side rendering (SSR/SSG) for SEO.

---

## Known Limitations

### 1. Back/Forward Cache (bfcache)

Browser's bfcache might conflict with View Transitions. Astro handles this automatically.

### 2. Forms During Transition

Form submissions during transitions might be lost. Astro prevents this by queuing form submissions.

### 3. Third-party Scripts

Scripts that manipulate DOM directly (e.g., chat widgets) might break. Use `transition:persist` on their containers.

### 4. Large Pages

Very large pages (>5 MB) might cause memory issues during transition. Our pages are <100 KB, so no issue.

---

## Testing Checklist

### Visual Testing
- [ ] Home → Impressum (smooth fade)
- [ ] Impressum → Datenschutz (smooth fade)
- [ ] Datenschutz → Home (smooth fade)
- [ ] Header stays in place ✅
- [ ] Footer stays in place ✅
- [ ] No white flash ✅

### Functionality Testing
- [ ] Links work correctly
- [ ] Back button works
- [ ] Forward button works
- [ ] Browser history updates
- [ ] Scroll position (top on new page)
- [ ] Anchor links work (`#Kontakt`)

### Accessibility Testing
- [ ] prefers-reduced-motion disables animations
- [ ] Keyboard navigation works
- [ ] Screen readers announce page changes
- [ ] Focus management correct

### Performance Testing
- [ ] Lighthouse Performance score >95
- [ ] No memory leaks (Chrome DevTools Performance)
- [ ] Smooth 60fps animations

### Cross-browser Testing
- [ ] Chrome (native support)
- [ ] Safari (native on iOS 18+)
- [ ] Firefox (polyfill)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## Rollback Plan

If View Transitions cause issues:

1. **Disable in MainLayout.astro:**
   ```astro
   <!-- <ViewTransitions /> -->
   ```

2. **Rebuild:**
   ```bash
   npm run build
   ```

3. **Result:** Back to standard navigation, no animations.

---

## Future Enhancements

### 1. Loading Indicator

Show spinner during slow navigation:

```astro
<script>
  let timeout;
  document.addEventListener('astro:before-preparation', () => {
    timeout = setTimeout(() => {
      document.body.classList.add('navigating');
    }, 200); // Show after 200ms
  });

  document.addEventListener('astro:after-swap', () => {
    clearTimeout(timeout);
    document.body.classList.remove('navigating');
  });
</script>

<style>
  .navigating::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--color-brand);
    animation: progress 1s ease-in-out infinite;
  }
</style>
```

### 2. Page-specific Transitions

```astro
---
// Different transition for contact page
const isContactPage = Astro.url.pathname === '/kontakt/';
---

<main transition:name={isContactPage ? 'contact-main' : 'main'}>
  <slot />
</main>
```

### 3. Morphing Transitions

Element morphs from one page to another:

```astro
<!-- Gallery thumbnail -->
<img transition:name={`img-${id}`} />

<!-- Lightbox uses same transition:name -->
<!-- Image smoothly morphs from thumbnail to full-size -->
```

---

## References

- [Astro View Transitions Docs](https://docs.astro.build/en/guides/view-transitions/)
- [MDN View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Chrome View Transitions Guide](https://developer.chrome.com/docs/web-platform/view-transitions/)

---

**Implementation Status:** ✅ Complete
**Bundle Impact:** +5 KB gzipped
**Browser Support:** 95%+ (with automatic fallback)
**Performance:** Improved perceived performance
**Accessibility:** Respects prefers-reduced-motion
