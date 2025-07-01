// Mobile-Optimized Gallery with Virtualization v2.0
class MobileOptimizedGallery {
  constructor(options = {}) {
    this.container = document.getElementById(options.containerId || 'galleryGrid');
    this.loadingElement = document.getElementById('galleryLoading');
    this.imagesPerBatch = options.imagesPerBatch || (this.isMobile() ? 10 : 12);
    this.visibleRange = options.visibleRange || (this.isMobile() ? 10 : 20);
    this.imagePrefix = 'img/image_';
    this.imageExtension = '.webp';
    this.totalImages = 180;
    this.loadedImages = [];
    this.visibleImages = [];
    this.currentBatch = 0;
    this.isLoading = false;
    this.observer = null;
    this.debounceTimer = null;
    
    // Performance optimizations
    this.imagePool = new Map();
    this.recycledElements = [];
    this.renderQueue = [];
    this.isRenderingScheduled = false;
    
    this.init();
  }

  isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  }

  init() {
    console.log('🚀 Initializing Mobile-Optimized Gallery');
    this.setupIntersectionObserver();
    this.setupEventListeners();
    this.loadInitialBatch();
    this.initVirtualization();
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: this.isMobile() ? '50px' : '100px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImageIfNeeded(entry.target);
        }
      });
    }, options);
  }

  setupEventListeners() {
    // Optimized scroll handling for mobile - DISABLED FOR MANUAL CONTROL
    // let scrollTimeout;
    // window.addEventListener('scroll', () => {
    //   if (scrollTimeout) clearTimeout(scrollTimeout);
    //   scrollTimeout = setTimeout(() => {
    //     this.handleScroll();
    //   }, this.isMobile() ? 50 : 16);
    // }, { passive: true });

    // Optimized resize handling
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    }, { passive: true });

    // Touch optimizations for mobile
    if (this.isMobile()) {
      this.setupTouchOptimizations();
    }
  }

  setupMobileNavigation() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.goToPreviousBatch());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.goToNextBatch());
    }
    
    this.updateNavigationState();
  }

  goToPreviousBatch() {
    if (this.currentBatch > 0) {
      this.loadBatchSync(this.currentBatch - 1);
    }
  }

  goToNextBatch() {
    const totalBatches = Math.ceil(this.totalImages / this.imagesPerBatch);
    if (this.currentBatch < totalBatches - 1) {
      this.loadBatchSync(this.currentBatch + 1);
    }
  }

  updateNavigationState() {
    const totalBatches = Math.ceil(this.totalImages / this.imagesPerBatch);
    
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentBatch === 0;
      this.prevBtn.style.opacity = this.currentBatch === 0 ? '0.5' : '1';
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentBatch >= totalBatches - 1;
      this.nextBtn.style.opacity = this.currentBatch >= totalBatches - 1 ? '0.5' : '1';
    }
    
    if (this.currentBatchDisplay) {
      this.currentBatchDisplay.textContent = this.currentBatch + 1;
    }
  }

  setupTouchOptimizations() {
    // Prevent bounce scrolling on iOS
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.gallery-item')) {
        e.preventDefault();
      }
    }, { passive: false });

    // Optimize touch interactions
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  handleTouchStart(e) {
    const item = e.target.closest('.gallery-item');
    if (item) {
      item.style.transform = 'scale(0.98)';
      item.style.transition = 'transform 0.1s ease';
    }
  }

  handleTouchEnd(e) {
    const item = e.target.closest('.gallery-item');
    if (item) {
      setTimeout(() => {
        item.style.transform = '';
        item.style.transition = '';
      }, 100);
    }
  }

  loadInitialBatch() {
    console.log('🚀 Загружаем начальный батч галереи');
    this.showLoading();
    
    try {
      // Создаем структуру контейнера
      this.container.innerHTML = `
        <div class="gallery-viewport">
          ${this.isMobile() ? `
            <div class="mobile-gallery-nav">
              <button class="gallery-nav-btn prev-btn" id="mobileGalleryPrev">
                <span>‹</span>
              </button>
              <div class="gallery-nav-info">
                <span class="current-batch">1</span> / <span class="total-batches">${Math.ceil(this.totalImages / this.imagesPerBatch)}</span>
              </div>
              <button class="gallery-nav-btn next-btn" id="mobileGalleryNext">
                <span>›</span>
              </button>
            </div>
          ` : ''}
          <div class="gallery-scroll-container" id="galleryScrollContainer">
            <!-- Изображения будут добавлены здесь -->
          </div>
        </div>
      `;

      this.scrollContainer = document.getElementById('galleryScrollContainer');
      this.prevBtn = document.getElementById('mobileGalleryPrev');
      this.nextBtn = document.getElementById('mobileGalleryNext');
      this.currentBatchDisplay = this.container.querySelector('.current-batch');
      
      console.log('✅ Создали структуру контейнера, scrollContainer:', !!this.scrollContainer);
      
      // Добавляем обработчики для навигации
      if (this.isMobile()) {
        this.setupMobileNavigation();
      }
      
      // Сразу загружаем и показываем первый батч без await
      this.loadBatchSync(0);
      
    } catch (error) {
      console.error('❌ Failed to load initial batch:', error);
      this.showError();
    }
  }

  loadBatchSync(batchIndex) {
    console.log(`📦 Синхронная загрузка батча ${batchIndex}`);
    
    this.currentBatch = batchIndex;
    
    // Сразу показываем изображения без предзагрузки
    this.hideLoading();
    this.startVirtualization();
    
    if (this.isMobile()) {
      this.updateNavigationState();
    }
  }

  async loadBatch(batchIndex) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    const startIndex = batchIndex * this.imagesPerBatch;
    const endIndex = Math.min(startIndex + this.imagesPerBatch, this.totalImages);
    
    console.log(`📦 Loading batch ${batchIndex}: images ${startIndex}-${endIndex}`);

    const promises = [];
    for (let i = startIndex; i < endIndex; i++) {
      promises.push(this.preloadImage(i + 1));
    }

    try {
      const results = await Promise.allSettled(promises);
      const loadedCount = results.filter(r => r.status === 'fulfilled').length;
      console.log(`✅ Loaded ${loadedCount}/${promises.length} images from batch ${batchIndex}`);
      
      this.currentBatch = batchIndex;
      this.updateVisibleImages();
      
      // Обновляем состояние навигации для мобильных
      if (this.isMobile()) {
        this.updateNavigationState();
      }
      
    } catch (error) {
      console.error(`❌ Failed to load batch ${batchIndex}:`, error);
    } finally {
      this.isLoading = false;
    }
  }

  async preloadImage(imageNum) {
    return new Promise((resolve, reject) => {
      if (this.imagePool.has(imageNum)) {
        resolve(this.imagePool.get(imageNum));
        return;
      }

      const img = new Image();
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Используем WebP с fallback
      const webpSrc = `${this.imagePrefix}${imageNum}${this.imageExtension}`;
      const jpgSrc = webpSrc.replace('.webp', '.jpg');
      
      img.onload = () => {
        this.imagePool.set(imageNum, {
          webpSrc,
          jpgSrc,
          loaded: true,
          element: img
        });
        resolve(img);
      };
      
      img.onerror = () => {
        // Попробуем загрузить JPG версию
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          this.imagePool.set(imageNum, {
            webpSrc: jpgSrc,
            jpgSrc,
            loaded: true,
            element: fallbackImg
          });
          resolve(fallbackImg);
        };
        fallbackImg.onerror = () => reject(new Error(`Failed to load image ${imageNum}`));
        fallbackImg.src = jpgSrc;
      };
      
      img.src = webpSrc;
    });
  }

  initVirtualization() {
    // Виртуализация для мобильных устройств
    this.itemHeight = this.isMobile() ? 200 : 320;
    this.itemsPerRow = this.isMobile() ? 2 : 3;
    
    // Для мобильной версии показываем только текущий батч
    if (this.isMobile()) {
      this.containerHeight = Math.ceil(this.imagesPerBatch / this.itemsPerRow) * this.itemHeight;
    } else {
      this.containerHeight = Math.ceil(this.totalImages / this.itemsPerRow) * this.itemHeight;
    }
    
    this.scrollContainer.style.height = `${this.containerHeight}px`;
    this.scrollContainer.style.position = 'relative';
    this.scrollContainer.style.display = 'grid';
    this.scrollContainer.style.gridTemplateColumns = `repeat(${this.itemsPerRow}, 1fr)`;
    this.scrollContainer.style.gap = '12px';
    this.scrollContainer.style.padding = '12px';
    
    console.log(`📱 Virtualization: ${this.itemsPerRow} items per row, ${this.itemHeight}px height`);
  }

  startVirtualization() {
    console.log('🎬 Начинаем виртуализацию галереи');
    
    // Для мобильной версии сразу показываем первый батч
    if (this.isMobile()) {
      this.renderMobileBatch();
    } else {
      this.updateVisibleItems();
      this.scheduleRender();
    }
  }

  updateVisibleItems() {
    // Упрощенная логика для десктопа
    if (this.isMobile()) {
      return; // Для мобильных используем renderMobileBatch
    }
    
    // Показываем первые изображения для десктопа
    this.visibleImages = [];
    for (let i = 0; i < Math.min(this.imagesPerBatch, this.totalImages); i++) {
      this.visibleImages.push(i + 1);
    }
    
    console.log('👀 Обновили видимые изображения:', this.visibleImages.length);
  }

  scheduleRender() {
    if (this.isRenderingScheduled) return;
    
    this.isRenderingScheduled = true;
    requestAnimationFrame(() => {
      this.renderVisibleItems();
      this.isRenderingScheduled = false;
    });
  }

  renderVisibleItems() {
    // Для мобильной версии просто показываем текущий батч
    if (this.isMobile()) {
      this.renderMobileBatch();
    } else {
      this.renderDesktopGrid();
    }
  }

  renderMobileBatch() {
    console.log('📱 Рендерим мобильный батч...', this.currentBatch);
    
    if (!this.scrollContainer) {
      console.error('❌ scrollContainer не найден!');
      return;
    }
    
    // Очищаем контейнер
    this.scrollContainer.innerHTML = '';
    
    // Показываем изображения текущего батча
    const startIndex = this.currentBatch * this.imagesPerBatch;
    const endIndex = Math.min(startIndex + this.imagesPerBatch, this.totalImages);
    
    console.log(`📱 Рендерим изображения ${startIndex + 1}-${endIndex}`);
    
    for (let i = startIndex; i < endIndex; i++) {
      const imageNum = i + 1;
      const element = this.createMobileGalleryItem(imageNum);
      this.scrollContainer.appendChild(element);
    }
    
    // Убираем лоадер и показываем галерею
    this.hideLoading();
    
    console.log(`✅ Успешно отрендерили батч ${this.currentBatch + 1}: ${endIndex - startIndex} изображений`);
  }

  renderDesktopGrid() {
    // Очищаем контейнер но сохраняем элементы для переиспользования
    const existingItems = Array.from(this.scrollContainer.children);
    existingItems.forEach(item => {
      item.style.display = 'none';
      this.recycledElements.push(item);
    });

    // Рендерим видимые элементы
    this.visibleImages.forEach((imageNum, index) => {
      const row = Math.floor((imageNum - 1) / this.itemsPerRow);
      const col = (imageNum - 1) % this.itemsPerRow;
      
      const element = this.getOrCreateGalleryItem(imageNum);
      
      // Позиционируем элемент
      element.style.position = 'absolute';
      element.style.top = `${row * this.itemHeight}px`;
      element.style.left = `${col * (100 / this.itemsPerRow)}%`;
      element.style.width = `${100 / this.itemsPerRow}%`;
      element.style.height = `${this.itemHeight - 20}px`;
      element.style.display = 'block';
      element.style.padding = '10px';
      element.style.boxSizing = 'border-box';
      
      if (!element.parentNode) {
        this.scrollContainer.appendChild(element);
      }
    });

    console.log(`🎨 Rendered ${this.visibleImages.length} visible items`);
  }

  getOrCreateGalleryItem(imageNum) {
    // Попробуем переиспользовать существующий элемент
    let element = this.recycledElements.find(el => 
      el.dataset.imageNum === imageNum.toString()
    );
    
    if (element) {
      this.recycledElements = this.recycledElements.filter(el => el !== element);
      return element;
    }

    // Создаем новый элемент
    element = this.recycledElements.pop() || document.createElement('div');
    element.className = 'gallery-item mobile-optimized';
    element.dataset.imageNum = imageNum;
    
    const imageData = this.imagePool.get(imageNum);
    
    element.innerHTML = `
      <div class="gallery-item-content">
        <picture>
          <source srcset="${this.imagePrefix}${imageNum}.webp" type="image/webp">
          <img 
            src="${this.imagePrefix}${imageNum}.jpg" 
            alt="Gartenbau Projekt ${imageNum}"
            loading="lazy"
            decoding="async"
            class="gallery-image"
          >
        </picture>
        <div class="gallery-overlay">
          <button class="gallery-view-btn" data-image="${imageNum}">
            <span>📷</span>
            Ansehen
          </button>
        </div>
      </div>
    `;

    // Добавляем обработчик клика
    element.addEventListener('click', () => {
      this.openLightbox(imageNum);
    });

    return element;
  }

  createMobileGalleryItem(imageNum) {
    const element = document.createElement('div');
    element.className = 'gallery-item mobile-optimized';
    element.dataset.imageNum = imageNum;
    
    element.innerHTML = `
      <div class="gallery-item-content">
        <picture>
          <source srcset="${this.imagePrefix}${imageNum}.webp" type="image/webp">
          <img 
            src="${this.imagePrefix}${imageNum}.jpg" 
            alt="Gartenbau Projekt ${imageNum}"
            loading="lazy"
            decoding="async"
            class="gallery-image"
          >
        </picture>
        <div class="gallery-overlay">
          <button class="gallery-view-btn" data-image="${imageNum}">
            <span>📷</span>
            Ansehen
          </button>
        </div>
      </div>
    `;

    // Добавляем обработчик клика
    element.addEventListener('click', () => {
      this.openLightbox(imageNum);
    });

    return element;
  }

  openLightbox(imageNum) {
    // Простая реализация лайтбокса для мобильных
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay mobile-lightbox';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close">&times;</button>
        <div class="lightbox-image-container">
          <picture>
            <source srcset="${this.imagePrefix}${imageNum}.webp" type="image/webp">
            <img 
              src="${this.imagePrefix}${imageNum}.jpg" 
              alt="Gartenbau Projekt ${imageNum}"
              class="lightbox-image"
            >
          </picture>
        </div>
        <div class="lightbox-nav">
          <button class="lightbox-prev" data-dir="-1">‹</button>
          <span class="lightbox-counter">${imageNum} / ${this.totalImages}</span>
          <button class="lightbox-next" data-dir="1">›</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Обработчики событий лайтбокса
    overlay.querySelector('.lightbox-close').addEventListener('click', () => {
      this.closeLightbox(overlay);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.closeLightbox(overlay);
      }
    });

    // Навигация по изображениям
    overlay.querySelectorAll('.lightbox-prev, .lightbox-next').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const direction = parseInt(e.target.dataset.dir);
        const newImageNum = Math.max(1, Math.min(this.totalImages, imageNum + direction));
        this.closeLightbox(overlay);
        setTimeout(() => this.openLightbox(newImageNum), 100);
      });
    });

    // Поддержка свайпов на мобильных
    if (this.isMobile()) {
      this.addSwipeSupport(overlay, imageNum);
    }
  }

  addSwipeSupport(overlay, imageNum) {
    let startX = 0;
    let startY = 0;
    
    overlay.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    overlay.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Проверяем горизонтальный свайп
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && imageNum > 1) {
          // Свайп вправо - предыдущее изображение
          this.closeLightbox(overlay);
          setTimeout(() => this.openLightbox(imageNum - 1), 100);
        } else if (deltaX < 0 && imageNum < this.totalImages) {
          // Свайп влево - следующее изображение
          this.closeLightbox(overlay);
          setTimeout(() => this.openLightbox(imageNum + 1), 100);
        }
      }
    }, { passive: true });
  }

  closeLightbox(overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    }, 200);
  }

  handleScroll() {
    this.updateVisibleItems();
    this.scheduleRender();
  }

  handleResize() {
    const newIsMobile = this.isMobile();
    if (newIsMobile !== this.isMobile()) {
      // Перинициализируем при изменении режима мобильный/десктоп
      this.itemsPerRow = newIsMobile ? 1 : 3;
      this.itemHeight = newIsMobile ? 280 : 320;
      this.initVirtualization();
      this.updateVisibleItems();
      this.scheduleRender();
    }
  }

  showLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'flex';
    }
  }

  hideLoading() {
    if (this.loadingElement) {
      this.loadingElement.style.display = 'none';
    }
    if (this.container) {
      this.container.style.display = 'block';
    }
  }

  showError() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="gallery-error">
          <h3>⚠️ Fehler beim Laden der Galerie</h3>
          <p>Bitte versuchen Sie es später erneut.</p>
          <button onclick="location.reload()" class="retry-btn">
            Neu laden
          </button>
        </div>
      `;
    }
  }
}

// Добавляем CSS стили для мобильной галереи
const mobileGalleryStyles = `
<style>
.mobile-gallery-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(45,90,61,0.1);
  backdrop-filter: blur(10px);
}

.gallery-nav-btn {
  background: linear-gradient(135deg, #2d5a3d, #4a8764);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  touch-action: manipulation;
  box-shadow: 0 2px 8px rgba(45,90,61,0.2);
}

.gallery-nav-btn:active {
  transform: scale(0.95);
}

.gallery-nav-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed;
}

.gallery-nav-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2d5a3d;
  font-size: 16px;
}

.current-batch {
  color: #4a8764;
  font-weight: 700;
}

.mobile-optimized {
  transition: transform 0.15s ease;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
}

.gallery-item-content {
  position: relative;
  width: 100%;
  height: 180px;
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(45,90,61,0.1);
}

@media (max-width: 768px) {
  .gallery-scroll-container {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 12px !important;
    padding: 12px !important;
    position: static !important;
    height: auto !important;
  }
  
  .gallery-item-content {
    height: 160px;
  }
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7) 100%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-optimized:hover .gallery-overlay,
.mobile-optimized:active .gallery-overlay {
  opacity: 1;
}

@media (hover: none) and (pointer: coarse) {
  .gallery-overlay {
    opacity: 1;
    background: linear-gradient(to bottom, transparent 70%, rgba(0,0,0,0.5) 100%);
  }
}

.gallery-view-btn {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2d5a3d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  min-height: 40px;
  touch-action: manipulation;
}

.gallery-view-btn:active {
  transform: scale(0.95);
  background: rgba(255,255,255,1);
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.95);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.2s ease;
}

.lightbox-content {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
}

.lightbox-close {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 24px;
  cursor: pointer;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}

.lightbox-image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: calc(95vh - 60px);
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0,0,0,0.7);
  border-radius: 0 0 8px 8px;
}

.lightbox-prev,
.lightbox-next {
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
}

.lightbox-counter {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.gallery-error {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.retry-btn {
  background: #2d5a3d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
  touch-action: manipulation;
}

@media (max-width: 768px) {
  .gallery-item-content {
    border-radius: 8px;
  }
  
  .lightbox-close {
    top: 5px;
    right: 5px;
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
  
  .lightbox-nav {
    padding: 8px;
  }
  
  .lightbox-prev,
  .lightbox-next {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>
`;

// Вставляем стили
document.head.insertAdjacentHTML('beforeend', mobileGalleryStyles);

// Экспортируем класс для использования
window.MobileOptimizedGallery = MobileOptimizedGallery;