/**
 * Image Optimizer Utility
 * Provides helper functions for responsive image srcset generation
 */

export interface ImageSrcSet {
  src: string;
  srcset: string;
  sizes: string;
}

export interface ResponsiveImageSizes {
  sm: number;
  md: number;
  lg: number;
}

const DEFAULT_SIZES: ResponsiveImageSizes = {
  sm: 640,
  md: 1024,
  lg: 1920,
};

/**
 * Generate srcset attributes for responsive images
 * @param imageName - Name of the image file (without extension)
 * @param extension - Image file extension (default: 'webp')
 * @param basePath - Base path for images (default: '/img/optimized/')
 * @returns Object with src, srcset, and sizes attributes
 */
export function getImageSrcSet(
  imageName: string,
  extension: string = 'webp',
  basePath: string = '/img/optimized/'
): ImageSrcSet {
  const sizes = DEFAULT_SIZES;

  return {
    src: `${basePath}${imageName}-lg.${extension}`,
    srcset: `
      ${basePath}${imageName}-sm.${extension} ${sizes.sm}w,
      ${basePath}${imageName}-md.${extension} ${sizes.md}w,
      ${basePath}${imageName}-lg.${extension} ${sizes.lg}w
    `.trim(),
    sizes: '(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px',
  };
}

/**
 * Generate picture element with multiple formats
 * @param imageName - Name of the image file (without extension)
 * @param alt - Alt text for the image
 * @param basePath - Base path for images (default: '/img/optimized/')
 * @returns HTML string for picture element
 */
export function getPictureElement(
  imageName: string,
  alt: string,
  basePath: string = '/img/optimized/'
): string {
  const webpSrcSet = getImageSrcSet(imageName, 'webp', basePath);

  return `
    <picture>
      <source
        type="image/webp"
        srcset="${webpSrcSet.srcset}"
        sizes="${webpSrcSet.sizes}"
      />
      <img
        src="${webpSrcSet.src}"
        alt="${alt}"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `.trim();
}

/**
 * Extract image number from filename (e.g., 'image_123' -> 123)
 * @param filename - Image filename
 * @returns Image number or null if not found
 */
export function extractImageNumber(filename: string): number | null {
  const match = filename.match(/image[_-]?(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Generate optimized image path
 * @param imageNumber - Image number
 * @param size - Size variant (sm, md, lg)
 * @param basePath - Base path for images (default: '/img/optimized/')
 * @returns Full path to optimized image
 */
export function getOptimizedImagePath(
  imageNumber: number,
  size: keyof ResponsiveImageSizes = 'lg',
  basePath: string = '/img/optimized/'
): string {
  return `${basePath}image_${imageNumber}-${size}.webp`;
}
