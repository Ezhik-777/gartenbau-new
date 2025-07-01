// Simple Universal Gallery - Fixed Version
console.log('Gallery script file loaded!');
window.galleryLoaded = true;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, gallery script starting...');
    
    // Check if we're on the right page
    const gallerySection = document.querySelector('.universal-gallery-section');
    if (!gallerySection) {
        console.log('No universal gallery section found on this page');
        return;
    }
    
    // Check if gallery exists
    const galleryGrid = document.getElementById('galleryGrid');
    const galleryLoading = document.getElementById('galleryLoading');
    
    console.log('Gallery elements check:', {
        galleryGrid: !!galleryGrid,
        galleryLoading: !!galleryLoading,
        gallerySection: !!gallerySection
    });
    
    if (!galleryGrid || !galleryLoading) {
        console.error('Required gallery elements not found');
        console.error('Missing elements:', {
            galleryGrid: !galleryGrid,
            galleryLoading: !galleryLoading
        });
        return;
    }
    
    console.log('All gallery elements found, initializing...');
    
    // Gallery configuration
    const config = {
        totalImages: 181,
        imagesPerPage: 24,
        currentPage: 1,
        currentView: 'grid'
    };
    
    // Generate all images
    const allImages = [];
    for (let i = 1; i <= config.totalImages; i++) {
        allImages.push({
            id: i,
            src: `img/image_${i}.webp`,
            alt: `Gartenbau Projekt ${i}`,
            title: getTitle(i),
            location: getLocation(i)
        });
    }
    
    console.log(`Generated ${allImages.length} images`);
    
    // Helper functions
    function getTitle(num) {
        const titles = [
            'Gartengestaltung', 'Terrasse', 'Naturstein', 'Pflasterung',
            'Sichtschutz', 'Rasenfläche', 'Bepflanzung', 'Wegebau'
        ];
        return titles[num % titles.length];
    }
    
    function getLocation(num) {
        const locations = [
            'Stuttgart', 'Ludwigsburg', 'Waiblingen', 'Remseck',
            'Fellbach', 'Kornwestheim', 'Esslingen', 'Böblingen'
        ];
        return locations[num % locations.length];
    }
    
    // Show loading initially
    function showLoading() {
        console.log('Showing loading...');
        galleryLoading.style.display = 'block';
        galleryGrid.style.display = 'none';
        
        const statsEl = document.getElementById('galleryStats');
        const paginationEl = document.getElementById('galleryPagination');
        
        if (statsEl) statsEl.style.display = 'none';
        if (paginationEl) paginationEl.style.display = 'none';
        
        // Animate progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += 20;
                progressBar.style.width = progress + '%';
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(hideLoading, 300);
                }
            }, 100);
        } else {
            // If no progress bar, just hide loading after short delay
            setTimeout(hideLoading, 1000);
        }
    }
    
    function hideLoading() {
        console.log('Hiding loading...');
        galleryLoading.style.display = 'none';
        galleryGrid.style.display = 'block';
        
        const statsEl = document.getElementById('galleryStats');
        const paginationEl = document.getElementById('galleryPagination');
        
        if (statsEl) statsEl.style.display = 'flex';
        if (paginationEl) paginationEl.style.display = 'flex';
        
        renderGallery();
        updateStats();
        setupPagination();
    }
    
    function renderGallery() {
        console.log('Rendering gallery...');
        const startIndex = (config.currentPage - 1) * config.imagesPerPage;
        const endIndex = startIndex + config.imagesPerPage;
        const pageImages = allImages.slice(startIndex, endIndex);
        
        console.log(`Rendering ${pageImages.length} images for page ${config.currentPage}`);
        
        galleryGrid.className = `universal-gallery-grid view-${config.currentView}`;
        
        galleryGrid.innerHTML = pageImages.map(img => `
            <div class="gallery-item">
                <div class="image-container">
                    <img src="${img.src}" alt="${img.alt}" loading="lazy" class="gallery-image" 
                         onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'image-placeholder\\'>Bild nicht verfügbar<br>📷</div>';">
                    <div class="image-overlay">
                        <div class="overlay-content">
                            <h3 class="image-title">${img.title}</h3>
                            <p class="image-location">📍 ${img.location}</p>
                            <div class="overlay-actions">
                                <a href="${img.src}" data-fancybox="universal-gallery" 
                                   data-caption="${img.alt}" class="view-btn">
                                    <span class="btn-icon">🔍</span>
                                    <span>Vergrößern</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Initialize Fancybox
        if (typeof $ !== 'undefined' && $.fancybox) {
            $('[data-fancybox="universal-gallery"]').fancybox({
                buttons: ["slideShow", "thumbs", "zoom", "fullScreen", "close"],
                loop: true,
                protect: true
            });
        }
    }
    
    function updateStats() {
        console.log('Updating stats...');
        const totalEl = document.getElementById('totalImages');
        const visibleEl = document.getElementById('visibleImages');
        const currentEl = document.getElementById('currentPage');
        
        if (totalEl) totalEl.textContent = config.totalImages;
        if (visibleEl) visibleEl.textContent = Math.min(config.imagesPerPage, allImages.length - (config.currentPage - 1) * config.imagesPerPage);
        if (currentEl) currentEl.textContent = config.currentPage;
    }
    
    function setupPagination() {
        console.log('Setting up pagination...');
        const totalPages = Math.ceil(allImages.length / config.imagesPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const numbersContainer = document.getElementById('pageNumbers');
        
        // Update button states
        if (prevBtn) prevBtn.disabled = config.currentPage <= 1;
        if (nextBtn) nextBtn.disabled = config.currentPage >= totalPages;
        
        // Generate page numbers (show only 5 around current)
        if (numbersContainer) {
            let pageNumbers = '';
            const maxButtons = 5;
            let startPage = Math.max(1, config.currentPage - Math.floor(maxButtons / 2));
            let endPage = Math.min(totalPages, startPage + maxButtons - 1);
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers += `
                    <button class="page-number ${i === config.currentPage ? 'active' : ''}" 
                            data-page="${i}">${i}</button>
                `;
            }
            
            numbersContainer.innerHTML = pageNumbers;
            
            // Add event listeners
            document.querySelectorAll('.page-number').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    config.currentPage = parseInt(e.target.dataset.page);
                    renderGallery();
                    updateStats();
                    setupPagination();
                    galleryGrid.scrollIntoView({ behavior: 'smooth' });
                });
            });
        }
    }
    
    // Setup view controls
    function setupViewControls() {
        console.log('Setting up view controls...');
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.view-btn').classList.add('active');
                config.currentView = e.target.closest('.view-btn').dataset.view;
                renderGallery();
            });
        });
    }
    
    // Setup pagination controls
    function setupPaginationControls() {
        console.log('Setting up pagination controls...');
        
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (config.currentPage > 1) {
                config.currentPage--;
                renderGallery();
                updateStats();
                setupPagination();
                galleryGrid.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        document.getElementById('nextPage')?.addEventListener('click', () => {
            const totalPages = Math.ceil(allImages.length / config.imagesPerPage);
            if (config.currentPage < totalPages) {
                config.currentPage++;
                renderGallery();
                updateStats();
                setupPagination();
                galleryGrid.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Setup search functionality
    function setupSearch() {
        console.log('Setting up search...');
        const searchInput = document.getElementById('gallerySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                // For now, just reset to show all images
                // Can be enhanced later with actual filtering
                config.currentPage = 1;
                renderGallery();
                updateStats();
                setupPagination();
            });
        }
    }
    
    // Initialize everything
    function init() {
        console.log('Initializing gallery...');
        setupViewControls();
        setupPaginationControls();
        setupSearch();
        showLoading();
    }
    
    // Start the gallery
    init();
    
    console.log('Gallery initialization complete');
});