// Instant Gallery - Immediate Loading
console.log('Instant gallery script loaded!');

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
} else {
    initGallery();
}

function initGallery() {
    console.log('Initializing instant gallery...');
    
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryLoading = document.getElementById('galleryLoading');
    
    if (!galleryGrid || !galleryLoading) {
        console.log('Gallery elements not found, skipping...');
        return;
    }
    
    console.log('Gallery elements found!');
    
    // Show loading for 1 second, then show gallery
    setTimeout(() => {
        console.log('Hiding loading, showing gallery...');
        galleryLoading.style.display = 'none';
        galleryGrid.style.display = 'grid';
        
        // Update stats
        const totalEl = document.getElementById('totalImages');
        const visibleEl = document.getElementById('visibleImages');
        const currentEl = document.getElementById('currentPage');
        const statsEl = document.getElementById('galleryStats');
        const paginationEl = document.getElementById('galleryPagination');
        
        if (totalEl) totalEl.textContent = '181';
        if (visibleEl) visibleEl.textContent = '24';
        if (currentEl) currentEl.textContent = '1';
        if (statsEl) statsEl.style.display = 'flex';
        if (paginationEl) paginationEl.style.display = 'flex';
        
        // Generate first 24 images
        const images = [];
        for (let i = 1; i <= 24; i++) {
            images.push(`
                <div class="gallery-item">
                    <div class="image-container">
                        <img src="img/image_${i}.webp" alt="Gartenbau Projekt ${i}" loading="lazy" class="gallery-image">
                        <div class="image-overlay">
                            <div class="overlay-content">
                                <h3 class="image-title">Projekt ${i}</h3>
                                <p class="image-location">📍 Stuttgart</p>
                                <div class="overlay-actions">
                                    <a href="img/image_${i}.webp" data-fancybox="gallery" class="view-btn">
                                        <span class="btn-icon">🔍</span>
                                        <span>Vergrößern</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        }
        
        galleryGrid.innerHTML = images.join('');
        galleryGrid.className = 'universal-gallery-grid view-grid';
        
        console.log('Gallery rendered with 24 images!');
        
        // Initialize Fancybox if available
        if (typeof $ !== 'undefined' && typeof $.fancybox === 'function') {
            console.log('Initializing Fancybox...');
            $('[data-fancybox="gallery"]').fancybox({
                buttons: ["slideShow", "thumbs", "zoom", "fullScreen", "close"],
                loop: true,
                protect: true
            });
        } else {
            console.log('Fancybox not available');
        }
        
    }, 1000);
}