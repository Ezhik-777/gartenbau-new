// Modern Intuitive Gallery with Perfect UX/UI
class ModernGallery {
  constructor() {
    this.container = document.getElementById('modernGallery');
    this.loader = document.getElementById('galleryLoader');
    this.loadMoreBtn = document.getElementById('loadMoreBtn');
    this.currentCountEl = document.getElementById('currentCount');
    this.totalCountEl = document.getElementById('totalCount');
    
    this.filters = document.querySelectorAll('.filter-btn');
    this.viewButtons = document.querySelectorAll('.view-btn');
    
    this.totalImages = 180;
    this.imagesPerLoad = 6;
    this.loadedImages = 0;
    this.currentFilter = 'all';
    this.currentView = 'grid';
    this.isLoading = false;
    
    // Image categories mapping
    this.imageCategories = this.generateImageCategories();
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('Gallery container not found');
      return;
    }
    
    console.log('🎨 Initializing Modern Gallery');
    
    this.bindEvents();
    this.loadInitialImages();
  }
  
  generateImageCategories() {
    const categories = ['garden', 'stone', 'terrace'];
    const mapping = {};
    
    for (let i = 1; i <= this.totalImages; i++) {
      // Distribute images across categories
      if (i <= 60) mapping[i] = 'garden';
      else if (i <= 105) mapping[i] = 'stone';
      else mapping[i] = 'terrace';
    }
    
    return mapping;
  }
  
  bindEvents() {
    // Filter buttons
    this.filters.forEach(filter => {
      filter.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleFilterChange(filter.dataset.filter);
      });
    });
    
    // View buttons
    this.viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleViewChange(btn.dataset.view);
      });
    });
    
    // Load more button
    this.loadMoreBtn?.addEventListener('click', () => {
      this.loadMoreImages();
    });
    
    // Infinite scroll DISABLED
    // window.addEventListener('scroll', this.throttle(() => {
    //   if (this.isNearBottom() && !this.isLoading && this.hasMoreImages()) {
    //     this.loadMoreImages();
    //   }
    // }, 300));
  }
  
  async loadInitialImages() {
    this.showLoader();
    
    // Reduced loading delay for faster performance
    await this.delay(200);
    
    this.loadedImages = 0;
    this.container.innerHTML = '';
    
    this.loadMoreImages();
  }
  
  loadMoreImages() {
    if (this.isLoading || !this.hasMoreImages()) return;
    
    this.isLoading = true;
    this.updateLoadMoreButton(true);
    
    const startIndex = this.loadedImages;
    const endIndex = Math.min(startIndex + this.imagesPerLoad, this.getFilteredImageCount());
    
    const imagesToLoad = this.getFilteredImages().slice(startIndex, endIndex);
    
    // Faster image loading without excessive animations
    setTimeout(() => {
      imagesToLoad.forEach((imageNum, index) => {
        setTimeout(() => {
          const imageElement = this.createGalleryItem(imageNum);
          imageElement.style.opacity = '0';
          this.container.appendChild(imageElement);
          
          // Quick fade in
          requestAnimationFrame(() => {
            imageElement.style.transition = 'opacity 0.2s ease';
            imageElement.style.opacity = '1';
          });
        }, index * 50);
      });
      
      this.loadedImages = endIndex;
      this.updateStats();
      this.updateLoadMoreButton(false);
      this.hideLoader();
      this.isLoading = false;
    }, 100);
  }
  
  createGalleryItem(imageNum) {
    const category = this.imageCategories[imageNum];
    const categoryNames = {
      garden: 'Gartengestaltung',
      stone: 'Naturstein',
      terrace: 'Terrassen'
    };
    
    const item = document.createElement('div');
    item.className = `gallery-item gallery-item-${category}`;
    item.dataset.category = category;
    item.dataset.imageNum = imageNum;
    
    item.innerHTML = `
      <div class="gallery-item-image">
        <picture>
          <source srcset="img/image_${imageNum}.webp" type="image/webp">
          <img 
            src="img/image_${imageNum}.jpg" 
            alt="Gartenbau Projekt ${imageNum} - ${categoryNames[category]}"
            loading="lazy"
            decoding="async"
          >
        </picture>
        <div class="gallery-item-badge">${categoryNames[category]}</div>
        <div class="gallery-item-overlay">
          <div class="gallery-item-info">
            <div class="gallery-item-title">Projekt ${imageNum}</div>
            <div class="gallery-item-category">${categoryNames[category]} • Stuttgart</div>
          </div>
        </div>
      </div>
    `;
    
    // Add click handler for lightbox
    item.addEventListener('click', () => {
      this.openLightbox(imageNum, category);
    });
    
    return item;
  }
  
  openLightbox(imageNum, category) {
    const categoryNames = {
      garden: 'Gartengestaltung',
      stone: 'Naturstein',
      terrace: 'Terrassen'
    };
    
    const lightbox = document.createElement('div');
    lightbox.className = 'modern-lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-backdrop"></div>
      <div class="lightbox-container">
        <button class="lightbox-close" aria-label="Schließen">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <div class="lightbox-content">
          <div class="lightbox-image-container">
            <picture>
              <source srcset="img/image_${imageNum}.webp" type="image/webp">
              <img 
                src="img/image_${imageNum}.jpg" 
                alt="Gartenbau Projekt ${imageNum}"
                class="lightbox-image"
              >
            </picture>
          </div>
          <div class="lightbox-info">
            <h3 class="lightbox-title">Projekt ${imageNum}</h3>
            <p class="lightbox-category">${categoryNames[category]} • Stuttgart & Region</p>
            <div class="lightbox-actions">
              <a href="tel:+491782747470" class="lightbox-btn primary">
                📞 Ähnliches Projekt anfragen
              </a>
              <a href="#Kontakt" class="lightbox-btn secondary" onclick="document.body.removeChild(document.querySelector('.modern-lightbox'))">
                💬 Kostenvoranschlag
              </a>
            </div>
          </div>
        </div>
        <div class="lightbox-nav">
          <button class="lightbox-nav-btn prev" data-dir="-1">‹</button>
          <span class="lightbox-counter">${imageNum} / ${this.totalImages}</span>
          <button class="lightbox-nav-btn next" data-dir="1">›</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.closeLightbox(lightbox);
    });
    
    lightbox.querySelector('.lightbox-backdrop').addEventListener('click', () => {
      this.closeLightbox(lightbox);
    });
    
    // Navigation
    lightbox.querySelectorAll('.lightbox-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const direction = parseInt(e.target.dataset.dir);
        const newImageNum = imageNum + direction;
        if (newImageNum >= 1 && newImageNum <= this.totalImages) {
          this.closeLightbox(lightbox);
          setTimeout(() => this.openLightbox(newImageNum, this.imageCategories[newImageNum]), 100);
        }
      });
    });
  }
  
  closeLightbox(lightbox) {
    lightbox.style.opacity = '0';
    setTimeout(() => {
      if (lightbox.parentNode) {
        document.body.removeChild(lightbox);
      }
      document.body.style.overflow = '';
    }, 200);
  }
  
  handleFilterChange(filter) {
    if (filter === this.currentFilter) return;
    
    // Update active filter button
    this.filters.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    this.currentFilter = filter;
    this.loadedImages = 0;
    this.container.innerHTML = '';
    
    this.showLoader();
    setTimeout(() => {
      this.loadMoreImages();
    }, 300);
  }
  
  handleViewChange(view) {
    if (view === this.currentView) return;
    
    this.viewButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    this.currentView = view;
    this.container.className = `gallery-grid view-${view}`;
  }
  
  getFilteredImages() {
    if (this.currentFilter === 'all') {
      return Array.from({length: this.totalImages}, (_, i) => i + 1);
    }
    
    return Object.entries(this.imageCategories)
      .filter(([_, category]) => category === this.currentFilter)
      .map(([imageNum, _]) => parseInt(imageNum));
  }
  
  getFilteredImageCount() {
    return this.getFilteredImages().length;
  }
  
  hasMoreImages() {
    return this.loadedImages < this.getFilteredImageCount();
  }
  
  updateStats() {
    if (this.currentCountEl) {
      this.currentCountEl.textContent = this.loadedImages;
    }
    if (this.totalCountEl) {
      this.totalCountEl.textContent = this.getFilteredImageCount();
    }
  }
  
  updateLoadMoreButton(loading) {
    if (!this.loadMoreBtn) return;
    
    const btnText = this.loadMoreBtn.querySelector('.btn-text');
    const btnCount = this.loadMoreBtn.querySelector('.btn-count');
    
    if (loading) {
      btnText.textContent = 'Lade weitere Projekte...';
      this.loadMoreBtn.disabled = true;
    } else if (this.hasMoreImages()) {
      btnText.textContent = 'Weitere Projekte laden';
      const remaining = this.getFilteredImageCount() - this.loadedImages;
      btnCount.textContent = `(${remaining} verbleibend)`;
      this.loadMoreBtn.disabled = false;
      this.loadMoreBtn.style.display = 'inline-flex';
    } else {
      this.loadMoreBtn.style.display = 'none';
    }
  }
  
  showLoader() {
    if (this.loader) {
      this.loader.style.display = 'flex';
    }
  }
  
  hideLoader() {
    if (this.loader) {
      this.loader.style.display = 'none';
    }
  }
  
  isNearBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000;
  }
  
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use
window.ModernGallery = ModernGallery;