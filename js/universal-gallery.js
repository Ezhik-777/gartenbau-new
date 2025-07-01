// Universal Dynamic Gallery
class UniversalGallery {
    constructor() {
        this.images = [];
        this.filteredImages = [];
        this.currentPage = 1;
        this.imagesPerPage = 24;
        this.currentView = 'grid';
        this.currentSort = 'newest';
        this.searchTerm = '';
        this.carouselIndex = 0;
        
        this.init();
    }
    
    async init() {
        await this.loadAllImages();
        this.setupEventListeners();
        this.showLoading();
        
        // Simulate loading time for better UX
        setTimeout(() => {
            this.hideLoading();
            this.renderGallery();
            this.updateStats();
            this.setupPagination();
        }, 1500);
    }
    
    async loadAllImages() {
        // Generate image array from 1 to 181
        const imageNumbers = Array.from({length: 181}, (_, i) => i + 1);
        
        this.images = imageNumbers.map(num => ({
            id: num,
            src: `img/image_${num}.webp`,
            alt: `Gartenbau Projekt ${num}`,
            caption: `Projekt ${num} - Garten- und Landschaftsbau`,
            category: this.getCategoryFromNumber(num),
            location: this.getLocationFromNumber(num),
            year: this.getYearFromNumber(num),
            type: this.getTypeFromNumber(num),
            title: this.getTitleFromNumber(num)
        }));
        
        this.filteredImages = [...this.images];
    }
    
    getCategoryFromNumber(num) {
        // Smart categorization based on image number
        const mod = num % 5;
        switch(mod) {
            case 1: return 'terrassen';
            case 2: return 'naturstein';
            case 3: return 'garten';
            case 4: return 'wege';
            default: return 'pflege';
        }
    }
    
    getLocationFromNumber(num) {
        const locations = [
            'Stuttgart', 'Ludwigsburg', 'Waiblingen', 'Remseck', 
            'Fellbach', 'Kornwestheim', 'Esslingen', 'Böblingen',
            'Sindelfingen', 'Leonberg', 'Ditzingen', 'Gerlingen'
        ];
        return locations[num % locations.length];
    }
    
    getYearFromNumber(num) {
        return 2020 + (num % 5); // Years from 2020-2024
    }
    
    getTypeFromNumber(num) {
        const types = [
            'Komplettgestaltung', 'Teilprojekt', 'Sanierung', 
            'Neubau', 'Modernisierung', 'Erweiterung'
        ];
        return types[num % types.length];
    }
    
    getTitleFromNumber(num) {
        const titles = [
            'Moderne Gartengestaltung',
            'Naturstein Terrasse',
            'Gepflasterte Einfahrt',
            'Sichtschutz Installation',
            'Rasenneuanlage',
            'Bepflanzung & Design',
            'Wasserspiel Anlage',
            'Outdoor Küche',
            'Pergola Construction',
            'Steinmauer Bau'
        ];
        return titles[num % titles.length];
    }
    
    setupEventListeners() {
        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                this.currentView = e.target.closest('.view-btn').dataset.view;
                this.renderGallery();
            });
        });
        
        // Search functionality
        const searchInput = document.getElementById('gallerySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
                this.currentPage = 1;
                this.renderGallery();
                this.updateStats();
                this.setupPagination();
            });
        }
        
        // Sort functionality
        const sortSelect = document.getElementById('gallerySort');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
                this.renderGallery();
            });
        }
        
        // Pagination
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.renderGallery();
                this.updateStats();
                this.setupPagination();
                this.scrollToGallery();
            }
        });
        
        document.getElementById('nextPage')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredImages.length / this.imagesPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.renderGallery();
                this.updateStats();
                this.setupPagination();
                this.scrollToGallery();
            }
        });
    }
    
    applyFilters() {
        let filtered = [...this.images];
        
        // Apply search filter
        if (this.searchTerm) {
            filtered = filtered.filter(img => 
                img.alt.toLowerCase().includes(this.searchTerm) ||
                img.location.toLowerCase().includes(this.searchTerm) ||
                img.title.toLowerCase().includes(this.searchTerm) ||
                img.type.toLowerCase().includes(this.searchTerm)
            );
        }
        
        // Apply sorting
        switch(this.currentSort) {
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                filtered.sort((a, b) => a.id - b.id);
                break;
            case 'random':
                filtered = this.shuffleArray(filtered);
                break;
        }
        
        this.filteredImages = filtered;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;
        
        container.className = `universal-gallery-grid view-${this.currentView}`;
        
        switch(this.currentView) {
            case 'grid':
                this.renderGridView(container);
                break;
            case 'masonry':
                this.renderMasonryView(container);
                break;
            case 'carousel':
                this.renderCarouselView(container);
                break;
        }
        
        // Initialize Fancybox for lightbox
        if (typeof $ !== 'undefined' && $.fancybox) {
            $('[data-fancybox="universal-gallery"]').fancybox({
                buttons: ["slideShow", "thumbs", "zoom", "fullScreen", "close"],
                loop: true,
                protect: true,
                animationEffect: "zoom-in-out",
                transitionEffect: "slide",
                toolbar: true,
                smallBtn: true
            });
        }
    }
    
    renderGridView(container) {
        const startIndex = (this.currentPage - 1) * this.imagesPerPage;
        const endIndex = startIndex + this.imagesPerPage;
        const pageImages = this.filteredImages.slice(startIndex, endIndex);
        
        container.innerHTML = pageImages.map(img => `
            <div class="gallery-item" data-category="${img.category}">
                <div class="image-container">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy" class="gallery-image">
                    <div class="image-overlay">
                        <div class="overlay-content">
                            <h3 class="image-title">${img.title}</h3>
                            <p class="image-location">📍 ${img.location}</p>
                            <p class="image-year">📅 ${img.year}</p>
                            <div class="overlay-actions">
                                <a href="${img.src}" data-fancybox="universal-gallery" 
                                   data-caption="${img.caption}" class="view-btn">
                                    <span class="btn-icon">🔍</span>
                                    <span>Vergrößern</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderMasonryView(container) {
        const startIndex = (this.currentPage - 1) * this.imagesPerPage;
        const endIndex = startIndex + this.imagesPerPage;
        const pageImages = this.filteredImages.slice(startIndex, endIndex);
        
        container.innerHTML = pageImages.map(img => `
            <div class="masonry-item" data-category="${img.category}">
                <div class="masonry-card">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy" class="masonry-image">
                    <div class="card-content">
                        <h4 class="card-title">${img.title}</h4>
                        <div class="card-meta">
                            <span class="meta-item">📍 ${img.location}</span>
                            <span class="meta-item">📅 ${img.year}</span>
                        </div>
                        <a href="${img.src}" data-fancybox="universal-gallery" 
                           data-caption="${img.caption}" class="card-view-btn">
                            Ansehen
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderCarouselView(container) {
        container.innerHTML = `
            <div class="carousel-container">
                <div class="carousel-track" id="carouselTrack">
                    ${this.filteredImages.map((img, index) => `
                        <div class="carousel-slide ${index === this.carouselIndex ? 'active' : ''}">
                            <img src="${img.src}" alt="${img.alt}" class="carousel-image">
                            <div class="carousel-info">
                                <h3>${img.title}</h3>
                                <p>📍 ${img.location} | 📅 ${img.year}</p>
                                <a href="${img.src}" data-fancybox="universal-gallery" 
                                   data-caption="${img.caption}" class="carousel-view-btn">
                                    Vergrößern
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="carousel-controls">
                    <button class="carousel-btn prev" id="carouselPrev">‹</button>
                    <button class="carousel-btn next" id="carouselNext">›</button>
                </div>
                <div class="carousel-indicators">
                    ${this.filteredImages.map((_, index) => `
                        <span class="indicator ${index === this.carouselIndex ? 'active' : ''}" 
                              data-index="${index}"></span>
                    `).join('')}
                </div>
            </div>
        `;
        
        this.setupCarouselControls();
    }
    
    setupCarouselControls() {
        document.getElementById('carouselPrev')?.addEventListener('click', () => {
            this.carouselIndex = this.carouselIndex > 0 ? this.carouselIndex - 1 : this.filteredImages.length - 1;
            this.updateCarousel();
        });
        
        document.getElementById('carouselNext')?.addEventListener('click', () => {
            this.carouselIndex = this.carouselIndex < this.filteredImages.length - 1 ? this.carouselIndex + 1 : 0;
            this.updateCarousel();
        });
        
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.carouselIndex = index;
                this.updateCarousel();
            });
        });
    }
    
    updateCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.carouselIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.carouselIndex);
        });
    }
    
    updateStats() {
        document.getElementById('totalImages').textContent = this.images.length;
        document.getElementById('visibleImages').textContent = this.filteredImages.length;
        document.getElementById('currentPage').textContent = this.currentPage;
    }
    
    setupPagination() {
        const totalPages = Math.ceil(this.filteredImages.length / this.imagesPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const numbersContainer = document.getElementById('pageNumbers');
        
        // Update button states
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= totalPages;
        
        // Generate page numbers
        let pageNumbers = '';
        const maxButtons = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers += `
                <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                        data-page="${i}">${i}</button>
            `;
        }
        
        numbersContainer.innerHTML = pageNumbers;
        
        // Add event listeners to page numbers
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentPage = parseInt(e.target.dataset.page);
                this.renderGallery();
                this.updateStats();
                this.setupPagination();
                this.scrollToGallery();
            });
        });
    }
    
    scrollToGallery() {
        document.getElementById('galleryGrid').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    showLoading() {
        document.getElementById('galleryLoading').style.display = 'block';
        document.getElementById('galleryGrid').style.display = 'none';
        document.getElementById('galleryStats').style.display = 'none';
        document.getElementById('galleryPagination').style.display = 'none';
        
        // Animate progress bar
        let progress = 0;
        const progressBar = document.getElementById('progressBar');
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }
    
    hideLoading() {
        document.getElementById('galleryLoading').style.display = 'none';
        document.getElementById('galleryGrid').style.display = 'block';
        document.getElementById('galleryStats').style.display = 'flex';
        document.getElementById('galleryPagination').style.display = 'flex';
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('galleryGrid')) {
        new UniversalGallery();
    }
});