# Image Optimization Guide

## Overview

The Gartenbau Z.M. website uses a comprehensive image optimization pipeline built with Sharp to generate responsive image variants. This ensures fast loading times across all devices while maintaining high visual quality.

## Architecture

### Directory Structure

```
astro-site/
├── public/
│   └── img/
│       ├── image_1.webp ... image_181.webp  (source images)
│       └── optimized/
│           ├── image_1-sm.webp   (640px wide)
│           ├── image_1-md.webp   (1024px wide)
│           ├── image_1-lg.webp   (1920px wide)
│           └── ... (268 optimized variants)
├── scripts/
│   └── optimize-images.js        (optimization script)
├── src/
│   └── utils/
│       └── getImageSrcSet.ts     (srcset utility functions)
└── tests/
    └── image-optimization.test.js (test suite)
```

### Generated Variants

For each source image, up to 3 variants are generated:

| Variant | Width | Quality | Use Case |
|---------|-------|---------|----------|
| **sm**  | 640px | 80%     | Mobile devices, gallery thumbnails |
| **md**  | 1024px| 85%     | Tablets, lightbox preview |
| **lg**  | 1920px| 85%     | Desktop displays, hero images |

**Note:** If the source image is smaller than a target size, that variant is skipped.

## Usage

### 1. Running the Optimization Script

```bash
# Optimize all images in public/img/image_*.webp
npm run optimize-images

# Test the optimization results
npm run test:images
```

### 2. Using Optimized Images in Components

#### Gallery Images

```tsx
import { getGallerySrcSet } from '../utils/getImageSrcSet';

const { src, srcset, sizes } = getGallerySrcSet('image_1');

<img
  src={src}
  srcSet={srcset}
  sizes={sizes}
  alt="Gallery image"
  loading="lazy"
/>
```

Generates:
```html
<img
  src="/img/optimized/image_1-sm.webp"
  srcset="
    /img/optimized/image_1-sm.webp 640w,
    /img/optimized/image_1-md.webp 1024w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Gallery image"
  loading="lazy"
/>
```

#### Hero Images

```tsx
import { getHeroSrcSet } from '../utils/getImageSrcSet';

const { src, srcset, sizes } = getHeroSrcSet('image_25');

<img
  src={src}
  srcSet={srcset}
  sizes={sizes}
  alt="Hero background"
/>
```

#### General Purpose

```tsx
import { getImageSrcSet } from '../utils/getImageSrcSet';

const { src, srcset, sizes } = getImageSrcSet('image_42');

<img
  src={src}
  srcSet={srcset}
  sizes={sizes}
  alt="Any image"
/>
```

## Optimization Details

### Configuration

From `scripts/optimize-images.js`:

```javascript
const CONFIG = {
  inputPattern: 'public/img/image_*.webp',
  outputDir: 'public/img/optimized',
  sizes: {
    sm: 640,
    md: 1024,
    lg: 1920,
  },
  quality: {
    sm: 80,
    md: 85,
    lg: 85,
  },
};
```

### Processing Features

1. **Smart Sizing**: Images are never enlarged - only downsized if source is larger than target
2. **Quality Control**: Different quality settings per size for optimal file size/quality balance
3. **Effort Level**: `effort: 6` for maximum compression efficiency
4. **Skip Existing**: Already optimized images are skipped for faster reruns
5. **Error Handling**: Individual image failures don't stop the entire process

## Performance Impact

### Before Optimization (Original Images)

- Format: WebP
- Average size: ~200-400 KB per image
- Total for 181 images: ~60 MB
- Loading time (3G): ~20-30s for full gallery

### After Optimization

- Generated variants: 268 files (1-2 variants per source)
- Small variant (640px): ~40-80 KB
- Medium variant (1024px): ~80-150 KB
- Large variant (1920px): ~150-300 KB
- Gallery initial load (20 images): ~800 KB - 1.6 MB
- Loading time (3G): ~3-5s for initial gallery view

### Savings

- **Mobile users**: 75-80% bandwidth savings (loading sm variant instead of original)
- **Tablet users**: 50-60% bandwidth savings (loading md variant instead of original)
- **Desktop users**: 20-30% bandwidth savings (loading lg variant with better compression)

## Testing

### Automated Tests

```bash
npm run test:images
```

Tests verify:
- ✓ Optimized directory exists
- ✓ Sample images have expected variants
- ✓ Minimum image count is met (268 variants)
- ✓ Images are in WebP format
- ✓ Dimensions match expected sizes

### Manual Testing

1. **Visual Quality Check**:
   ```bash
   npm run dev
   # Visit http://localhost:4321
   # Check gallery images on different devices
   ```

2. **Performance Check**:
   - Open DevTools Network tab
   - Filter by "Img"
   - Reload page and verify correct sizes are loaded
   - Mobile viewport should load `*-sm.webp`
   - Desktop viewport should load `*-md.webp` or `*-lg.webp`

3. **Build Check**:
   ```bash
   npm run build
   # Verify optimized images are copied to dist/img/optimized/
   ls dist/img/optimized/*.webp | wc -l  # Should show 268
   ```

## Adding New Images

1. **Add source images** to `public/img/`:
   ```bash
   cp new-image.webp public/img/image_182.webp
   ```

2. **Run optimization**:
   ```bash
   npm run optimize-images
   ```

3. **Verify results**:
   ```bash
   npm run test:images
   ```

4. **Update image data** in your components to include the new image.

## Troubleshooting

### Issue: "No images found matching pattern"

**Solution**: Make sure you're running the script from the `astro-site` directory:
```bash
cd astro-site
npm run optimize-images
```

### Issue: Optimized images not showing on website

**Solution**: Verify images are in the correct directory and names match:
```bash
ls public/img/optimized/image_1-sm.webp  # Should exist
```

Also check your component is using the correct utility:
```tsx
const { src } = getGallerySrcSet('image_1');  // Not 'image_1.webp'
```

### Issue: Build fails with "Module not found"

**Solution**: Make sure the utility is imported correctly:
```tsx
import { getGallerySrcSet } from '../utils/getImageSrcSet';
// Not from './utils/getImageSrcSet' or 'utils/getImageSrcSet'
```

### Issue: Images look pixelated on large screens

**Solution**: Check if the source image is large enough:
```bash
npm run optimize-images  # Check the output
# If it says "source too small, skipping" for lg variant,
# the source image needs to be larger than 1920px wide
```

## Best Practices

1. **Source Images**: Use high-quality source images (1920px+ width for best results)
2. **Lazy Loading**: Always use `loading="lazy"` except for above-the-fold images
3. **Alt Text**: Always provide descriptive alt text for accessibility
4. **Width/Height**: Include `width` and `height` attributes to prevent layout shift
5. **Preload Critical Images**: For hero images, consider preloading:
   ```html
   <link rel="preload" as="image" href="/img/optimized/hero-md.webp" />
   ```

## Integration with Build Pipeline

The optimization is integrated into the build process:

```json
{
  "scripts": {
    "build": "npm run optimize-images && astro check && astro build"
  }
}
```

This ensures:
1. Images are optimized before each production build
2. Any new images are automatically processed
3. Build fails if optimization fails
4. Optimized images are included in the dist folder

## Future Improvements

Potential enhancements for v6.0:

- [ ] AVIF format support (even better compression)
- [ ] Automatic blur placeholder generation
- [ ] Image CDN integration
- [ ] On-demand optimization (instead of pre-build)
- [ ] WebP → AVIF fallback chain
- [ ] Metadata extraction for auto-generated alt text

## References

- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [Responsive Images MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [WebP Format](https://developers.google.com/speed/webp)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)
