/**
 * Gartenbau Z.M. - Main JavaScript v2.0
 * Professional Landscaping Website
 */

(function() {
  'use strict';

  // =====================================================
  // DOM Elements
  // =====================================================
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const scrollTopBtn = document.getElementById('scrollTop');
  const heroProgress = document.getElementById('heroProgress');

  // =====================================================
  // Header Scroll Effect
  // =====================================================
  function initHeaderScroll() {
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      // Add scrolled class
      if (currentScroll > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', throttle(handleScroll, 10), { passive: true });
    handleScroll(); // Initial check
  }

  // =====================================================
  // Mobile Menu
  // =====================================================
  function initMobileMenu() {
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
        closeMenu();
      }
    });

    // Close menu on outside click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('mobile-menu--open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.add('mobile-menu--open');
    menuToggle.classList.add('menu-toggle--active');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    mobileMenu.classList.remove('mobile-menu--open');
    menuToggle.classList.remove('menu-toggle--active');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  // =====================================================
  // Hero Slider
  // =====================================================
  function initHeroSlider() {
    const slider = document.querySelector('.hero__slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevBtn = document.querySelector('.hero__arrow--prev');
    const nextBtn = document.querySelector('.hero__arrow--next');
    const progressBar = heroProgress;

    if (slides.length <= 1) return;

    let currentSlide = 0;
    let slideInterval;
    let progressInterval;
    const slideDuration = 6000; // 6 seconds
    const progressStep = 50; // Update progress every 50ms

    function showSlide(index) {
      // Remove active class from all slides and dots
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      // Set new active slide
      currentSlide = (index + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) {
        dots[currentSlide].classList.add('active');
      }

      // Reset progress
      resetProgress();
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function resetProgress() {
      if (!progressBar) return;

      let progress = 0;
      progressBar.style.width = '0%';

      clearInterval(progressInterval);
      progressInterval = setInterval(() => {
        progress += (progressStep / slideDuration) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
      }, progressStep);
    }

    function startAutoplay() {
      stopAutoplay();
      slideInterval = setInterval(nextSlide, slideDuration);
      resetProgress();
    }

    function stopAutoplay() {
      clearInterval(slideInterval);
      clearInterval(progressInterval);
    }

    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        startAutoplay();
      });
    });

    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoplay();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoplay();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Start autoplay
    startAutoplay();
  }

  // =====================================================
  // Scroll to Top
  // =====================================================
  function initScrollTop() {
    if (!scrollTopBtn) return;

    function handleScroll() {
      if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
    handleScroll();
  }

  // =====================================================
  // Smooth Scroll for Anchor Links
  // =====================================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#main') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = header ? header.offsetHeight : 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // =====================================================
  // Gallery Filter
  // =====================================================
  function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter__btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter items
        galleryItems.forEach(item => {
          const category = item.dataset.category;

          if (filter === 'all' || category === filter) {
            item.style.display = '';
            item.style.animation = 'fadeIn 0.3s ease forwards';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // =====================================================
  // Lightbox
  // =====================================================
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const lightboxImage = document.getElementById('lightboxImage');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let currentIndex = 0;
    const images = [];

    // Collect all images
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        images.push({
          src: img.src,
          alt: img.alt
        });

        item.addEventListener('click', () => {
          openLightbox(index);
        });
      }
    });

    function openLightbox(index) {
      currentIndex = index;
      updateLightboxImage();
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function updateLightboxImage() {
      if (images[currentIndex]) {
        lightboxImage.src = images[currentIndex].src;
        lightboxImage.alt = images[currentIndex].alt;
      }
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxImage();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxImage();
    }

    // Event listeners
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // Close on backdrop click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox__content')) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          showPrev();
          break;
        case 'ArrowRight':
          showNext();
          break;
      }
    });
  }

  // =====================================================
  // Load More (Gallery)
  // =====================================================
  function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    if (!loadMoreBtn) return;

    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    let currentPage = 1;
    const imagesPerPage = 20;
    const totalImages = 149; // Total available images

    loadMoreBtn.addEventListener('click', () => {
      const startIndex = currentPage * imagesPerPage + 1;
      const endIndex = Math.min(startIndex + imagesPerPage - 1, totalImages);

      if (startIndex > totalImages) {
        loadMoreBtn.style.display = 'none';
        return;
      }

      // Create new gallery items
      const categories = ['garten', 'terrassen', 'naturstein', 'pflaster'];
      const captions = ['Gartengestaltung', 'Terrasse', 'Naturstein', 'Pflaster', 'Projekt'];

      for (let i = startIndex; i <= endIndex; i++) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.dataset.category = categories[Math.floor(Math.random() * categories.length)];

        item.innerHTML = `
          <img src="../img/gal-${i}.webp" alt="Gartenprojekt ${i}" class="gallery-item__image" loading="lazy">
          <div class="gallery-item__overlay">
            <span class="gallery-item__caption">${captions[Math.floor(Math.random() * captions.length)]}</span>
          </div>
        `;

        galleryGrid.appendChild(item);

        // Add to lightbox
        const img = item.querySelector('img');
        if (img) {
          item.addEventListener('click', () => {
            // Trigger lightbox if initialized
          });
        }
      }

      currentPage++;

      // Hide button if no more images
      if (endIndex >= totalImages) {
        loadMoreBtn.style.display = 'none';
      }
    });
  }

  // =====================================================
  // Form Validation
  // =====================================================
  function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
      const inputs = form.querySelectorAll('[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('error');
        } else {
          input.classList.remove('error');
        }
      });

      // Email validation
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
          isValid = false;
          emailInput.classList.add('error');
        }
      }

      if (!isValid) {
        e.preventDefault();
      }
    });

    // Remove error class on input
    form.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
      });
    });
  }

  // =====================================================
  // Accordion
  // =====================================================
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        accordionItems.forEach(i => i.classList.remove('active'));

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }

  // =====================================================
  // Intersection Observer for Animations
  // =====================================================
  function initAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .stat, .process-step');

    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // =====================================================
  // Utility Functions
  // =====================================================
  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // =====================================================
  // Add CSS Animation Keyframes
  // =====================================================
  function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .form-input.error,
      .form-textarea.error {
        border-color: var(--color-error);
      }
    `;
    document.head.appendChild(style);
  }

  // =====================================================
  // Initialize
  // =====================================================
  function init() {
    addAnimationStyles();
    initHeaderScroll();
    initMobileMenu();
    initHeroSlider();
    initScrollTop();
    initSmoothScroll();
    initGalleryFilter();
    initLightbox();
    initLoadMore();
    initFormValidation();
    initAccordion();
    initAnimations();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
