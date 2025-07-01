// Modern Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Gallery Categories Filter
    const categoryButtons = document.querySelectorAll('.category-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update grid layout
            updateGridLayout();
        });
    });
    
    // Load More Functionality
    const loadMoreBtn = document.getElementById('loadMoreProjects');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = `
                <span class="btn-icon">⏳</span>
                <span class="btn-text">Lade weitere Projekte...</span>
            `;
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                loadAdditionalProjects();
                this.style.display = 'none';
            }, 2000);
        });
    }
    
    // Initialize Fancybox for gallery
    if (typeof $ !== 'undefined' && $.fancybox) {
        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                "slideShow",
                "thumbs",
                "zoom",
                "fullScreen",
                "share",
                "close"
            ],
            loop: true,
            protect: true,
            animationEffect: "zoom-in-out",
            transitionEffect: "slide",
            toolbar: true,
            smallBtn: true,
            iframe: {
                preload: false
            }
        });
    }
    
    // Touch swipe for mobile gallery
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    galleryItems.forEach(item => {
        item.addEventListener('touchstart', handleTouchStart, { passive: true });
        item.addEventListener('touchmove', handleTouchMove, { passive: true });
        item.addEventListener('touchend', handleTouchEnd, { passive: true });
    });
    
    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
    }
    
    function handleTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    }
    
    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = currentX - startX;
        if (Math.abs(deltaX) > 50) {
            // Trigger swipe action if needed
            console.log('Swipe detected:', deltaX > 0 ? 'right' : 'left');
        }
    }
    
    // Update grid layout function
    function updateGridLayout() {
        const grid = document.querySelector('.modern-gallery-grid');
        if (grid) {
            // Force reflow to update grid layout
            grid.style.display = 'none';
            grid.offsetHeight; // Trigger reflow
            grid.style.display = 'grid';
        }
    }
    
    // Load additional projects function
    function loadAdditionalProjects() {
        const grid = document.querySelector('.modern-gallery-grid');
        const additionalProjects = [
            {
                category: 'garten',
                image: 'img/gal-7.webp',
                fallback: 'img/gal-7.jpg',
                title: 'Komplette Neugestaltung',
                location: 'Kornwestheim',
                alt: 'Gartengestaltung Kornwestheim'
            },
            {
                category: 'terrassen',
                image: 'img/gal-8.webp',
                fallback: 'img/gal-8.jpg',
                title: 'Designer Terrasse',
                location: 'Esslingen',
                alt: 'Designer Terrasse Esslingen'
            },
            {
                category: 'naturstein',
                image: 'img/gal-9.webp',
                fallback: 'img/gal-9.jpg',
                title: 'Natursteintreppe',
                location: 'Böblingen',
                alt: 'Natursteintreppe Böblingen'
            }
        ];
        
        additionalProjects.forEach((project, index) => {
            setTimeout(() => {
                const projectHTML = `
                    <div class="gallery-item" data-category="${project.category}" style="opacity: 0; transform: translateY(30px);">
                        <picture>
                            <source srcset="${project.image}" type="image/webp">
                            <img src="${project.fallback}" alt="${project.alt}" loading="lazy" class="gallery-image">
                        </picture>
                        <div class="project-overlay">
                            <div class="project-info">
                                <div class="project-category">${getCategoryName(project.category)}</div>
                                <h3 class="project-title">${project.title}</h3>
                                <div class="project-location">
                                    <span class="location-icon">📍</span>
                                    <span>${project.location}</span>
                                </div>
                                <a href="${project.image}" class="view-btn" data-fancybox="gallery" data-caption="${project.alt}">
                                    <span class="btn-icon">👁️</span>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                
                grid.insertAdjacentHTML('beforeend', projectHTML);
                
                // Animate in the new item
                const newItem = grid.lastElementChild;
                setTimeout(() => {
                    newItem.style.opacity = '1';
                    newItem.style.transform = 'translateY(0)';
                }, 100);
                
                // Re-initialize Fancybox for new items
                if (typeof $ !== 'undefined' && $.fancybox) {
                    $('[data-fancybox="gallery"]').fancybox();
                }
            }, index * 200);
        });
    }
    
    // Helper function to get category display name
    function getCategoryName(category) {
        const categoryNames = {
            'terrassen': 'Terrassen & Plätze',
            'naturstein': 'Natursteinarbeiten',
            'garten': 'Gartengestaltung',
            'wege': 'Wege & Zufahrten'
        };
        return categoryNames[category] || category;
    }
    
    // Lazy loading for images
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, observerOptions);
    
    // Observe all gallery images
    document.querySelectorAll('.gallery-image[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Initialize animations on scroll
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        animateOnScroll.observe(item);
    });
    
    console.log('Modern Gallery initialized successfully!');
});