/**
 * Generate responsive image srcset attributes for optimized images
 *
 * @param imageName - Base image name (e.g., 'image_1' without .webp extension)
 * @returns Object with src, srcset, and sizes attributes for responsive images
 *
 * @example
 * ```tsx
 * const { src, srcset, sizes } = getImageSrcSet('image_1');
 * <img src={src} srcset={srcset} sizes={sizes} alt="..." />
 * ```
 */
export function getImageSrcSet(imageName: string) {
  // Remove .webp extension if present
  const baseName = imageName.replace(/\.webp$/, '');

  return {
    // Default src - use small variant for faster initial load
    src: `/img/optimized/${baseName}-sm.webp`,

    // Responsive srcset with all available sizes
    srcset: [
      `/img/optimized/${baseName}-sm.webp 640w`,
      `/img/optimized/${baseName}-md.webp 1024w`,
      `/img/optimized/${baseName}-lg.webp 1920w`,
    ].join(', '),

    // Sizes hint for browser to select appropriate image
    // Mobile: full width
    // Tablet: full width
    // Desktop: up to 1920px
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px',
  };
}

/**
 * Check if an optimized image variant exists
 * Used to handle images that might not have all size variants
 *
 * @param imageName - Base image name
 * @param size - Size variant ('sm' | 'md' | 'lg')
 * @returns Boolean indicating if the variant exists
 */
export function hasImageVariant(_imageName: string, size: 'sm' | 'md' | 'lg'): boolean {
  // In production, all images should have at least 'sm' variant
  // Larger variants depend on source image dimensions
  if (size === 'sm') return true;

  // For md and lg, we can't determine without checking file system
  // In browser context, just assume they exist - browser will handle 404s gracefully
  return true;
}

/**
 * Generate srcset for gallery masonry layout
 * Optimized for different viewport sizes and layouts
 *
 * @param imageName - Base image name
 * @returns Optimized srcset for gallery display
 */
export function getGallerySrcSet(imageName: string) {
  const baseName = imageName.replace(/\.webp$/, '');

  return {
    src: `/img/optimized/${baseName}-sm.webp`,
    srcset: [
      `/img/optimized/${baseName}-sm.webp 640w`,
      `/img/optimized/${baseName}-md.webp 1024w`,
    ].join(', '),
    // Gallery typically shows images in columns
    // Mobile: 1 column = 100vw
    // Tablet: 2 columns = 50vw
    // Desktop: 3 columns = 33vw
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  };
}

/**
 * Generate srcset for hero/featured images
 * Uses largest variants for visual impact
 *
 * @param imageName - Base image name
 * @returns Optimized srcset for hero display
 */
export function getHeroSrcSet(imageName: string) {
  const baseName = imageName.replace(/\.webp$/, '');

  return {
    src: `/img/optimized/${baseName}-md.webp`,
    srcset: [
      `/img/optimized/${baseName}-sm.webp 640w`,
      `/img/optimized/${baseName}-md.webp 1024w`,
      `/img/optimized/${baseName}-lg.webp 1920w`,
    ].join(', '),
    // Hero images typically fill viewport
    sizes: '100vw',
  };
}
