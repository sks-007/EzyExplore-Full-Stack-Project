// Main JavaScript functionality for EzyExplorer

class MainApp {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupNotificationStyles();
        this.setupErrorHandling();
        this.loadData();
    }
    
    loadData() {
        // Load Explore and Blog data from JSON
        fetch("data.json")
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                console.log('Data loaded successfully:', data);
                this.renderExplore(data.explore);
                this.renderBlogs(data.blogs);
            })
            .catch(err => {
                console.error("Error loading JSON:", err);
                // Show user-friendly error message
                this.showError("Failed to load content. Please refresh the page.");
            });
    }
    
    renderExplore(exploreData) {
        const exploreContainer = document.getElementById("destinations-grid");
        if (!exploreContainer) {
            console.warn("Destinations grid container not found");
            return;
        }
        
        exploreContainer.innerHTML = "";

        if (!exploreData || exploreData.length === 0) {
            exploreContainer.innerHTML = '<p>No destinations available.</p>';
            return;
        }

        exploreData.forEach(place => {
            const cardHTML = `
                <div class="destination-card" data-category="${place.category || 'all'}">
                    <div class="destination-image">
                        <img src="${place.image}" alt="${place.title}" loading="lazy">
                        ${place.eco ? '<div class="eco-badge"><i class="fas fa-leaf"></i> Eco-Friendly</div>' : ''}
                    </div>
                    <div class="destination-content">
                        <h3 class="destination-title">${place.title}</h3>
                        <p class="destination-description">${place.description}</p>
                        <div class="destination-footer">
                            <div class="destination-rating">
                                <span class="stars">★★★★★</span>
                                <span class="rating-text">${place.rating || '4.5'}</span>
                            </div>
                            <button class="btn-wishlist" aria-label="Add to wishlist">
                                <i class="far fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            exploreContainer.innerHTML += cardHTML;
        });
        
        console.log(`Rendered ${exploreData.length} destinations`);
    }
    
    renderBlogs(blogData) {
        const blogContainer = document.getElementById("blog-grid");
        if (!blogContainer) {
            console.warn("Blog grid container not found");
            return;
        }
        
        blogContainer.innerHTML = "";

        if (!blogData || blogData.length === 0) {
            blogContainer.innerHTML = '<p>No blog posts available.</p>';
            return;
        }

        blogData.forEach(blog => {
            const blogHTML = `
                <article class="blog-card">
                    <div class="blog-image">
                        <img src="${blog.image}" alt="${blog.title}" loading="lazy">
                        <div class="blog-category">${blog.category || 'Travel'}</div>
                    </div>
                    <div class="blog-content">
                        <h3 class="blog-title">${blog.title}</h3>
                        <p class="blog-excerpt">${blog.description}</p>
                        <div class="blog-meta">
                            <span class="blog-author">By ${blog.author || 'Anonymous'}</span>
                            <span class="blog-date">${blog.date || 'Recently'}</span>
                        </div>
                    </div>
                </article>
            `;
            blogContainer.innerHTML += blogHTML;
        });
        
        console.log(`Rendered ${blogData.length} blog posts`);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
    
    setupSmoothScrolling() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const navbar = document.querySelector('.navbar');
            
            if (!navbar) return;
            
            // Add scrolled class for navbar styling
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (only on desktop)
            if (window.innerWidth > 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }
    
    setupAnimations() {
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .destination-card, .review-card, .tip-card, .blog-card, .buddy-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
        
        // Counter animations for statistics
        this.setupCounterAnimations();
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => counterObserver.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString();
        }, 16);
    }
    
    setupNotificationStyles() {
        // Add notification styles if they don't exist
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .success-notification,
                .error-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    color: white;
                    padding: 1rem 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1001;
                    transform: translateX(400px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }
                
                .success-notification {
                    background: #10b981;
                }
                
                .error-notification {
                    background: #ef4444;
                }
                
                .success-notification.show,
                .error-notification.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .field-error {
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                
                .form-group input.error {
                    border-color: #ef4444;
                    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
        
        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
}

// Utility functions
const Utils = {
    // Debounce function for performance optimization
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for scroll events
    throttle: (func, limit) => {
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
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format number with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    
    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};

// Universal notification popup function
window.showNotificationPopup = function(title, message, type = 'success') {
    const overlay = document.createElement('div');
    overlay.className = 'plan-success-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'plan-success-popup';
    
    // Color scheme based on type
    let bgColor, icon;
    switch(type) {
        case 'success':
            bgColor = '#10b981'; // Green
            icon = 'fa-check-circle';
            break;
        case 'error':
            bgColor = '#ef4444'; // Red
            icon = 'fa-times-circle';
            break;
        case 'info':
            bgColor = '#1e3a8a'; // Navy blue
            icon = 'fa-info-circle';
            break;
        default:
            bgColor = '#10b981';
            icon = 'fa-check-circle';
    }
    
    popup.innerHTML = `
        <i class="fas ${icon}" style="color: ${bgColor};"></i>
        <h3>${title}</h3>
        <p>${message}</p>
        <button id="notification-popup-ok-btn" style="background: ${bgColor};">OK</button>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    const closePopup = () => {
        popup.remove();
        overlay.remove();
    };

    popup.querySelector('#notification-popup-ok-btn').addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);

    // Auto close after 3 seconds
    setTimeout(closePopup, 3000);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new MainApp();
    
    // Add utility functions to window for global access
    window.Utils = Utils;
});

// Export for use in other modules
window.MainApp = MainApp;