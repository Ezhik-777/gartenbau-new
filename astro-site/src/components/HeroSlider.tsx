import { useState, useEffect, useCallback } from 'react';
import './HeroSlider.css';

interface Slide {
  id: number;
  image: string;
  badge: {
    icon: string;
    text: string;
  };
  title: string;
  subtitle: string;
  cta: {
    primary: {
      text: string;
      href: string;
    };
    secondary: {
      text: string;
      href: string;
    };
  };
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/img/image_25.webp',
    badge: {
      icon: '🌱',
      text: 'Professioneller Gartenbau'
    },
    title: 'Gartenbau Z.M. – Professioneller Garten- und Landschaftsbau',
    subtitle: 'in Remseck, Stuttgart & Region',
    cta: {
      primary: {
        text: '🏡 Jetzt Beratung anfragen',
        href: '#Kontakt'
      },
      secondary: {
        text: '📸 Referenzen ansehen',
        href: '#Projekte'
      }
    }
  },
  {
    id: 2,
    image: '/img/image_42.webp',
    badge: {
      icon: '🪨',
      text: 'Natursteinarbeiten'
    },
    title: 'Hochwertige Natursteinarbeiten',
    subtitle: 'Mauern, Treppen & Einfassungen',
    cta: {
      primary: {
        text: '📞 Jetzt anrufen',
        href: 'tel:+491782747470'
      },
      secondary: {
        text: '💬 WhatsApp',
        href: 'https://wa.me/+491782747470'
      }
    }
  },
  {
    id: 3,
    image: '/img/image_87.webp',
    badge: {
      icon: '🏗️',
      text: 'Terrassenbau'
    },
    title: 'Moderne Terrassen & Außenanlagen',
    subtitle: 'Ihr Outdoor-Wohnzimmer',
    cta: {
      primary: {
        text: '✨ Kostenlos beraten lassen',
        href: '#Kontakt'
      },
      secondary: {
        text: '📋 Unsere Leistungen',
        href: '#Leistungen'
      }
    }
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [currentSlide, isTransitioning]);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlideData = slides[currentSlide];

  return (
    <section
      className="hero-slider"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="banner"
      aria-label="Hero Slider"
    >
      {/* Slides */}
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''} ${
              index < currentSlide ? 'prev' : ''
            }`}
            style={{
              backgroundImage: `url(${slide.image})`
            }}
            aria-hidden={index !== currentSlide}
          >
            <div className="slide-overlay"></div>
            <div className="container">
              <div className="hero-content">
                {/* Badge */}
                <div className="hero-badge" aria-label={slide.badge.text}>
                  <span className="badge-icon" aria-hidden="true">
                    {slide.badge.icon}
                  </span>
                  <span className="badge-text">{slide.badge.text}</span>
                </div>

                {/* Title */}
                {index === 0 ? (
                  <h1 className="hero-title">{slide.title}</h1>
                ) : (
                  <h2 className="hero-title">{slide.title}</h2>
                )}
                <p className="hero-subtitle">{slide.subtitle}</p>

                {/* CTA Buttons */}
                <div className="hero-ctas">
                  <a href={slide.cta.primary.href} className="hero-cta primary">
                    {slide.cta.primary.text}
                  </a>
                  <a href={slide.cta.secondary.href} className="hero-cta secondary">
                    {slide.cta.secondary.text}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="hero-nav prev"
        onClick={prevSlide}
        aria-label="Vorheriger Slide"
        disabled={isTransitioning}
      >
        ‹
      </button>
      <button
        className="hero-nav next"
        onClick={nextSlide}
        aria-label="Nächster Slide"
        disabled={isTransitioning}
      >
        ›
      </button>

      {/* Indicators */}
      <div className="hero-indicators" role="tablist" aria-label="Slide navigation">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            role="tab"
            aria-selected={index === currentSlide}
            aria-label={`Gehe zu Slide ${index + 1}`}
            disabled={isTransitioning}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="hero-progress">
        <div
          className="progress-bar"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`
          }}
        />
      </div>
    </section>
  );
}
