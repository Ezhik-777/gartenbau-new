import { useState, useEffect, useRef } from 'react';
import { getGallerySrcSet } from '../utils/getImageSrcSet';
import './GalleryGrid.css';

interface Image {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  width: number;
  height: number;
}

interface Props {
  images: Image[];
}

export default function GalleryGrid({ images }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const [visibleImages, setVisibleImages] = useState<Image[]>([]);
  const [loadedCount, setLoadedCount] = useState(20); // Start with 20 images
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter images based on active filter
  const filteredImages = filter === 'all'
    ? images
    : images.filter(img => img.category === filter);

  // Update visible images when filter or loadedCount changes
  useEffect(() => {
    setVisibleImages(filteredImages.slice(0, loadedCount));
  }, [filter, loadedCount, filteredImages]);

  // Reset loaded count when filter changes
  useEffect(() => {
    setLoadedCount(20);
  }, [filter]);

  // Intersection Observer for infinite scroll with optimized threshold
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedCount < filteredImages.length) {
          setLoadedCount(prev => Math.min(prev + 20, filteredImages.length));
        }
      },
      {
        threshold: 0.5,
        rootMargin: '100px'
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [loadedCount, filteredImages.length]);

  // Handle filter button clicks
  useEffect(() => {
    const buttons = document.querySelectorAll('.filter-btn');

    const handleFilterClick = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const filterValue = btn.dataset.filter || 'all';

      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      setFilter(filterValue);
    };

    buttons.forEach(btn => {
      btn.addEventListener('click', handleFilterClick);
    });

    return () => {
      buttons.forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
      });
    };
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLightboxIndex(prev =>
          prev === null || prev === 0 ? filteredImages.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLightboxIndex(prev =>
          prev === null ? 0 : (prev + 1) % filteredImages.length
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, filteredImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev =>
      prev === null || prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex(prev =>
      prev === null ? 0 : (prev + 1) % filteredImages.length
    );
  };

  // Get category label for badges
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'garden':
        return { icon: '🌱', label: 'Gartengestaltung' };
      case 'stone':
        return { icon: '🪨', label: 'Naturstein' };
      case 'terrace':
        return { icon: '🏗️', label: 'Terrassenbau' };
      default:
        return { icon: '📷', label: 'Projekt' };
    }
  };

  return (
    <>
      {/* Gallery Grid - Masonry Layout */}
      <div className="gallery-grid masonry">
        {visibleImages.map((image, index) => {
          // Extract image name from src (e.g., 'image_1' from '/img/image_1.webp')
          const imageName = image.src.split('/').pop()?.replace('.webp', '') || '';
          const { src: optimizedSrc, srcset, sizes } = getGallerySrcSet(imageName);
          const categoryInfo = getCategoryLabel(image.category);

          return (
            <div
              key={image.id}
              className="gallery-item"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
              aria-label={`Öffnen ${image.alt}`}
            >
              <img
                src={optimizedSrc}
                srcSet={srcset}
                sizes={sizes}
                alt={image.alt}
                loading="lazy"
                width={image.width}
                height={image.height}
              />
              <div className="gallery-item-overlay">
                <span className="gallery-item-icon">🔍</span>
                <span className="gallery-item-title">{image.title}</span>
              </div>
              <span className={`gallery-category-badge ${image.category}`}>
                <span className="category-icon">{categoryInfo.icon}</span>
                <span className="category-label">{categoryInfo.label}</span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Sentinel for infinite scroll */}
      {loadedCount < filteredImages.length && (
        <div ref={sentinelRef} className="gallery-sentinel">
          <div className="gallery-loader">Lädt mehr Bilder...</div>
        </div>
      )}

      {/* Status */}
      <div className="gallery-status">
        {visibleImages.length} von {filteredImages.length} Projekten angezeigt
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="lightbox fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Bildgalerie Lightbox"
        >
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Lightbox schließen"
          >
            ×
          </button>

          <button
            className="lightbox-prev"
            onClick={goToPrevious}
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {(() => {
              // Use large quality for lightbox to show full detail
              const imageName = filteredImages[lightboxIndex].src.split('/').pop()?.replace('.webp', '') || '';
              const lightboxSrc = `/img/optimized/${imageName}-lg.webp`;
              const currentImage = filteredImages[lightboxIndex];
              const categoryInfo = getCategoryLabel(currentImage.category);

              return (
                <div className="lightbox-image-wrapper">
                  <img
                    src={lightboxSrc}
                    alt={currentImage.alt}
                    className="lightbox-image"
                  />
                </div>
              );
            })()}
            <div className="lightbox-caption">
              <div className="lightbox-title">
                {filteredImages[lightboxIndex].title}
              </div>
              <div className="lightbox-meta">
                <span className="lightbox-category">
                  {getCategoryLabel(filteredImages[lightboxIndex].category).icon} {getCategoryLabel(filteredImages[lightboxIndex].category).label}
                </span>
                <span className="lightbox-counter">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
              </div>
            </div>
          </div>

          <button
            className="lightbox-next"
            onClick={goToNext}
            aria-label="Nächstes Bild"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
