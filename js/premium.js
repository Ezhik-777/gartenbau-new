/**
 * Gartenbau Z.M. - Premium JavaScript v3.0
 * Advanced Animations, Micro-interactions & UX
 */

(function() {
  'use strict';

  // =====================================================
  // Ripple Effect for Buttons
  // =====================================================
  function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn-premium, .btn');

    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // =====================================================
  // Smooth Image Loading
  // =====================================================
  function initImageLoading() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });

        img.addEventListener('error', () => {
          img.classList.add('loaded');
          // Optionally add placeholder
        });
      }
    });
  }

  // =====================================================
  // Scroll Progress Indicator
  // =====================================================
  function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress__bar"></div>';
    document.body.appendChild(progressBar);

    const bar = progressBar.querySelector('.scroll-progress__bar');

    const style = document.createElement('style');
    style.textContent = `
      .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        z-index: 9999;
        pointer-events: none;
      }
      .scroll-progress__bar {
        height: 100%;
        background: var(--gradient-brand);
        width: 0%;
        transition: width 0.1s ease-out;
      }
    `;
    document.head.appendChild(style);

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      bar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // =====================================================
  // Cursor Follower (Desktop Only)
  // =====================================================
  function initCursorFollower() {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor-follower';
    document.body.appendChild(cursor);

    const style = document.createElement('style');
    style.textContent = `
      .cursor-follower {
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(45, 90, 61, 0.15);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.15s ease-out, width 0.2s, height 0.2s, background 0.2s;
        transform: translate(-50%, -50%);
        mix-blend-mode: multiply;
      }
      .cursor-follower.active {
        width: 40px;
        height: 40px;
        background: rgba(45, 90, 61, 0.25);
      }
      .cursor-follower.link-hover {
        width: 50px;
        height: 50px;
        background: rgba(45, 90, 61, 0.1);
        border: 2px solid var(--color-brand);
      }
    `;
    document.head.appendChild(style);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animate);
    }
    animate();

    // Add hover effects
    document.querySelectorAll('a, button, .clickable').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('link-hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('link-hover'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
  }

  // =====================================================
  // Smooth Anchor Scroll
  // =====================================================
  function initSmoothAnchor() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#main') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const header = document.getElementById('header');
          const offset = header ? header.offsetHeight + 20 : 100;

          window.scrollTo({
            top: target.offsetTop - offset,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  // =====================================================
  // Lazy Load Sections
  // =====================================================
  // =====================================================
  // Unified IntersectionObserver для всех анимаций
  // =====================================================
  function initUnifiedObserver() {
    // Единый observer для sections, reveals, и counters (3 observers → 1)
    const unifiedObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const target = entry.target;

        // Section visibility
        if (target.classList.contains('section')) {
          target.classList.add('section-visible');
        }

        // Reveal animations (все варианты)
        const revealClasses = ['reveal', 'reveal-left', 'reveal-right', 'reveal-scale', 'stagger-children'];
        if (revealClasses.some(cls => target.classList.contains(cls))) {
          target.classList.add('revealed');
        }

        // Counter animations
        if (target.classList.contains('counter') && target.hasAttribute('data-target')) {
          animateCounter(target);
          unifiedObserver.unobserve(target); // Unobserve after animation
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all relevant elements
    const elementsToObserve = [
      ...document.querySelectorAll('.section'),
      ...document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'),
      ...document.querySelectorAll('.counter[data-target]')
    ];

    elementsToObserve.forEach(el => {
      unifiedObserver.observe(el);
    });

    console.log(`[Premium] Unified Observer: ${elementsToObserve.length} elements (3 observers → 1)`);
  }

  function initLazySections() {
    // Moved to initUnifiedObserver
  }

  // =====================================================
  // Enhanced Gallery Lightbox
  // =====================================================
  function initEnhancedLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'enhanced-lightbox';
    lightbox.innerHTML = `
      <div class="enhanced-lightbox__backdrop"></div>
      <div class="enhanced-lightbox__content">
        <button class="enhanced-lightbox__close" aria-label="Schliessen">&times;</button>
        <button class="enhanced-lightbox__prev" aria-label="Vorheriges Bild">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <img class="enhanced-lightbox__image" src="" alt="">
        <button class="enhanced-lightbox__next" aria-label="Naechstes Bild">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
        <div class="enhanced-lightbox__counter"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .enhanced-lightbox {
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s ease;
      }
      .enhanced-lightbox.active {
        opacity: 1;
        visibility: visible;
      }
      .enhanced-lightbox__backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
      }
      .enhanced-lightbox__content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
      }
      .enhanced-lightbox__image {
        max-width: 90vw;
        max-height: 85vh;
        object-fit: contain;
        border-radius: var(--radius-lg);
        transform: scale(0.9);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .enhanced-lightbox.active .enhanced-lightbox__image {
        transform: scale(1);
      }
      .enhanced-lightbox__close {
        position: absolute;
        top: -50px;
        right: 0;
        width: 40px;
        height: 40px;
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 28px;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .enhanced-lightbox__close:hover {
        background: rgba(255,255,255,0.2);
        transform: scale(1.1);
      }
      .enhanced-lightbox__prev,
      .enhanced-lightbox__next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 50px;
        height: 50px;
        background: rgba(255,255,255,0.1);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .enhanced-lightbox__prev { left: -70px; }
      .enhanced-lightbox__next { right: -70px; }
      .enhanced-lightbox__prev:hover,
      .enhanced-lightbox__next:hover {
        background: rgba(255,255,255,0.2);
        transform: translateY(-50%) scale(1.1);
      }
      .enhanced-lightbox__prev svg,
      .enhanced-lightbox__next svg {
        width: 24px;
        height: 24px;
      }
      .enhanced-lightbox__counter {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        color: rgba(255,255,255,0.7);
        font-size: 14px;
      }
      @media (max-width: 768px) {
        .enhanced-lightbox__prev { left: 10px; }
        .enhanced-lightbox__next { right: 10px; }
        .enhanced-lightbox__close { top: 10px; right: 10px; }
      }
    `;
    document.head.appendChild(style);

    const images = [];
    let currentIndex = 0;

    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (img) {
        images.push({ src: img.src, alt: img.alt });
        item.addEventListener('click', () => openLightbox(index));
      }
    });

    const lightboxImage = lightbox.querySelector('.enhanced-lightbox__image');
    const counter = lightbox.querySelector('.enhanced-lightbox__counter');
    const closeBtn = lightbox.querySelector('.enhanced-lightbox__close');
    const prevBtn = lightbox.querySelector('.enhanced-lightbox__prev');
    const nextBtn = lightbox.querySelector('.enhanced-lightbox__next');
    const backdrop = lightbox.querySelector('.enhanced-lightbox__backdrop');

    function openLightbox(index) {
      currentIndex = index;
      updateImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateImage() {
      lightboxImage.src = images[currentIndex].src;
      lightboxImage.alt = images[currentIndex].alt;
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) showNext();
        else showPrev();
      }
    }, { passive: true });
  }

  // =====================================================
  // Page Transition Effect
  // =====================================================
  function initPageTransitions() {
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'page-transition';
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      .page-transition {
        position: fixed;
        inset: 0;
        background: var(--color-brand);
        z-index: 99999;
        transform: translateY(100%);
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }
      .page-transition.active {
        transform: translateY(0);
      }
      .page-transition.exit {
        transform: translateY(-100%);
      }
    `;
    document.head.appendChild(style);

    // Handle internal links
    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
      if (link.target === '_blank') return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('active');

        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });

    // On page load
    window.addEventListener('pageshow', () => {
      overlay.classList.remove('active');
      overlay.classList.add('exit');
      setTimeout(() => {
        overlay.classList.remove('exit');
      }, 500);
    });
  }

  // =====================================================
  // Scroll Reveal Animations
  // =====================================================
  function initScrollReveal() {
    // Moved to initUnifiedObserver
  }

  // =====================================================
  // Counter Animation
  // =====================================================
  function initCounters() {
    // Moved to initUnifiedObserver
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const start = 0;
    const startTime = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const currentValue = Math.floor(start + (target - start) * easedProgress);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  // =====================================================
  // Hero Scroll Indicator
  // =====================================================
  function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-premium__scroll');

    if (!scrollIndicator) return;

    // Hide on scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(20px)';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.transform = 'translateX(-50%) translateY(0)';
      }

      lastScroll = currentScroll;
    }, { passive: true });

    // Click to scroll
    scrollIndicator.addEventListener('click', () => {
      const hero = document.querySelector('.hero-premium');
      if (hero) {
        const nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // =====================================================
  // 3D Tilt Effect for Cards
  // =====================================================
  function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.card-premium, .service-premium, .testimonial-premium');

    if (!tiltCards.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });
  }

  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    card.style.transform = '';
  }

  // =====================================================
  // Parallax Effect for Hero Background
  // =====================================================
  function initParallax() {
    const heroImage = document.querySelector('.hero-premium__bg img');

    if (!heroImage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const parallaxSpeed = 0.3;
          heroImage.style.transform = `translateY(${scrollY * parallaxSpeed}px) scale(1.1)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // =====================================================
  // Premium Accordion
  // =====================================================
  function initPremiumAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (!accordionItems.length) return;

    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');

      if (!trigger || !content) return;

      // Set initial height for animation
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      }

      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        accordionItems.forEach(otherItem => {
          const otherContent = otherItem.querySelector('.accordion-content');
          const otherTrigger = otherItem.querySelector('.accordion-trigger');

          otherItem.classList.remove('active');
          if (otherContent) otherContent.style.maxHeight = '0px';
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // =====================================================
  // Smooth Fade In for Images
  // =====================================================
  function initImageFadeIn() {
    const images = document.querySelectorAll('.gallery-item__image, .about-section__image img');

    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => {
          img.classList.add('loaded');
        });
      }
    });
  }

  // =====================================================
  // Premium Header Effects
  // =====================================================
  function initPremiumHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Add glass effect when scrolled
      if (currentScroll > 100) {
        header.classList.add('header--glass');
      } else {
        header.classList.remove('header--glass');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // =====================================================
  // Floating CTA Visibility
  // =====================================================
  function initFloatingCTA() {
    const floatingCTA = document.querySelector('.floating-cta');
    if (!floatingCTA) return;

    let lastScroll = 0;
    let isHidden = false;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      // Show after scrolling past hero
      if (currentScroll > window.innerHeight * 0.5) {
        floatingCTA.classList.add('visible');
      } else {
        floatingCTA.classList.remove('visible');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // =====================================================
  // Magnetic Button Effect
  // =====================================================
  function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-premium');

    if (!buttons.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    buttons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = '';
      });
    });
  }

  // =====================================================
  // Add CSS for Premium Effects
  // =====================================================
  function addPremiumStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Header Glass Effect */
      .header--glass {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }

      /* Floating CTA Visibility */
      .floating-cta {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }

      .floating-cta.visible {
        opacity: 1;
        pointer-events: auto;
      }

      /* Image Fade In */
      .gallery-item__image,
      .about-section__image img {
        opacity: 0;
        transition: opacity 0.5s ease;
      }

      .gallery-item__image.loaded,
      .about-section__image img.loaded {
        opacity: 1;
      }

      /* Accordion Animation */
      .accordion-content {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        padding: 0 var(--space-6);
      }

      .accordion-item.active .accordion-content {
        padding: var(--space-4) var(--space-6) var(--space-6);
      }

      .accordion-trigger {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-5) var(--space-6);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-xl);
        font-size: var(--text-lg);
        font-weight: var(--font-semibold);
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .accordion-trigger:hover {
        background: var(--bg-secondary);
      }

      .accordion-item.active .accordion-trigger {
        border-radius: var(--radius-xl) var(--radius-xl) 0 0;
        border-bottom-color: transparent;
        background: var(--bg-primary);
      }

      .accordion-item.active .accordion-content {
        border: 1px solid var(--border-color);
        border-top: none;
        border-radius: 0 0 var(--radius-xl) var(--radius-xl);
        background: var(--bg-primary);
      }

      .accordion-icon {
        width: 24px;
        height: 24px;
        color: var(--text-tertiary);
        transition: transform 0.3s ease;
        flex-shrink: 0;
      }

      .accordion-item.active .accordion-icon {
        transform: rotate(180deg);
      }

      .accordion-content p {
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
      }

      /* Hero Scroll Indicator */
      .hero-premium__scroll {
        position: absolute;
        bottom: var(--space-8);
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-3);
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
      }

      .hero-premium__scroll-text {
        font-size: var(--text-sm);
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
      }

      .hero-premium__scroll-mouse {
        width: 24px;
        height: 40px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 12px;
        position: relative;
      }

      .hero-premium__scroll-wheel {
        width: 4px;
        height: 8px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 2px;
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        animation: scrollWheel 2s ease-in-out infinite;
      }

      @keyframes scrollWheel {
        0%, 100% {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        50% {
          transform: translateX(-50%) translateY(10px);
          opacity: 0.3;
        }
      }

      /* Premium Stat Layout Fix */
      .premium-stat {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .premium-stat__number {
        display: inline;
      }

      /* Services Grid */
      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--space-8);
      }

      @media (max-width: 768px) {
        .services-grid {
          grid-template-columns: 1fr;
        }
      }

      /* Accordion Spacing */
      .accordion {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      /* Service Area Tags */
      .service-area {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-3);
      }

      .service-area__tag {
        padding: var(--space-3) var(--space-5);
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-full);
        font-size: var(--text-sm);
        font-weight: var(--font-medium);
        color: var(--text-secondary);
        transition: all 0.3s ease;
      }

      .service-area__tag:hover {
        background: var(--color-brand);
        border-color: var(--color-brand);
        color: var(--color-neutral-0);
        transform: translateY(-2px);
      }

      /* CTA Section Background */
      .cta-section {
        position: relative;
        background: var(--gradient-brand);
        padding: var(--space-20) 0;
        text-align: center;
        overflow: hidden;
      }

      .cta-section__bg {
        position: absolute;
        inset: 0;
        background: var(--gradient-dark-mesh);
        opacity: 0.5;
      }

      .cta-section__title {
        position: relative;
        color: var(--color-neutral-0);
        font-size: var(--text-4xl);
        margin-bottom: var(--space-4);
      }

      .cta-section__text {
        position: relative;
        color: rgba(255, 255, 255, 0.9);
        font-size: var(--text-lg);
        max-width: 600px;
        margin: 0 auto var(--space-8);
      }

      .cta-section__buttons {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--space-4);
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hero-premium__scroll {
          display: none;
        }

        .premium-stat__number {
          font-size: var(--text-3xl);
        }

        .cta-section__title {
          font-size: var(--text-3xl);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // =====================================================
  // Initialize All Premium Features
  // =====================================================
  function init() {
    // Core UX
    addPremiumStyles();
    initImageLoading();
    initRippleEffect();
    initScrollProgress();
    initSmoothAnchor();

    // Animations
    // Unified observer replaces: initScrollReveal, initCounters, initLazySections
    initUnifiedObserver();

    // Hero
    initScrollIndicator();
    initParallax();

    // Interactive Elements
    initTiltEffect();
    initPremiumAccordion();
    initEnhancedLightbox();
    initMagneticButtons();

    // Header & Navigation
    initPremiumHeader();
    initFloatingCTA();

    // Advanced (Desktop)
    initCursorFollower();
    initPageTransitions();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
