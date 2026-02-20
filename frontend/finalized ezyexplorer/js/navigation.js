// Enhanced Navigation and Smooth Scrolling

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.logo = document.getElementById('logo');
        this.currentSection = 'home';
        this.isScrolling = false;
        this.lastScrollY = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSmoothScrolling();
        this.setupActiveSectionTracking();
        this.setupScrollEffects();
        this.setupLogoInteraction();
        this.setupButtonHandlers();
    }
    
    setupEventListeners() {
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavLinkClick(e);
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }
    
    setupSmoothScrolling() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }
    
    setupActiveSectionTracking() {
        // Create intersection observer for sections
        const sections = document.querySelectorAll('section[id]');
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateActiveSection(entry.target.id);
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Navbar background effect
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll (only on desktop)
            if (window.innerWidth > 768) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                    this.navbar.style.transform = 'translateY(-100%)';
                } else {
                    this.navbar.style.transform = 'translateY(0)';
                }
            }
            
            this.lastScrollY = currentScrollY;
        });
    }
    
    setupLogoInteraction() {
        // Logo click to scroll to top
        this.logo.addEventListener('click', () => {
            this.smoothScrollTo(document.getElementById('home'));
        });
        
        // Add cursor styles
        this.logo.style.cursor = 'grab';
        
        this.logo.addEventListener('mousedown', () => {
            this.logo.style.cursor = 'grabbing';
        });
        
        this.logo.addEventListener('mouseup', () => {
            this.logo.style.cursor = 'grab';
        });
        
        this.logo.addEventListener('mouseleave', () => {
            this.logo.style.cursor = 'grab';
        });
    }
    
    setupButtonHandlers() {
        // Start Exploring button
        const exploreBtn = document.getElementById('explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.smoothScrollTo(document.getElementById('explore'));
            });
        }
        
        // Learn More button
        const learnMoreBtn = document.getElementById('learn-more-btn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.smoothScrollTo(document.getElementById('about'));
            });
        }
    }
    
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Add animation classes
        if (this.navMenu.classList.contains('active')) {
            this.navLinks.forEach((link, index) => {
                link.style.animationDelay = `${index * 0.1}s`;
                link.classList.add('fade-in-up');
            });
        }
    }
    
    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Remove animation classes
        this.navLinks.forEach(link => {
            link.classList.remove('fade-in-up');
        });
    }
    
    handleNavLinkClick(e) {
        const link = e.target.closest('.nav-link');
        if (!link) return;
        
        const sectionId = link.getAttribute('data-section');
        if (sectionId) {
            this.updateActiveSection(sectionId);
        }
    }
    
    updateActiveSection(sectionId) {
        if (this.currentSection === sectionId) return;
        
        // Remove active class from all nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        this.currentSection = sectionId;
    }
    
    smoothScrollTo(element) {
        const navbarHeight = this.navbar.offsetHeight;
        const targetPosition = element.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Scroll Progress Indicator
class ScrollProgressIndicator {
    constructor() {
        this.createProgressBar();
        this.setupScrollListener();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
    }
    
    setupScrollListener() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            this.progressBar.style.width = scrollPercent + '%';
        });
    }
}

// Page Load Animations
class PageAnimations {
    constructor() {
        this.setupIntersectionObserver();
        this.setupStaggeredAnimations();
        this.setupCounterAnimations();
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Add specific animation classes based on element type
                    this.addSpecificAnimations(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections and cards
        document.querySelectorAll('section, .destination-card, .review-card, .tip-card, .blog-card, .story-card, .buddy-card, .product-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }
    
    setupStaggeredAnimations() {
        // Staggered animation for cards in grids
        const grids = document.querySelectorAll('.destinations-grid, .reviews-grid, .tips-grid, .blog-grid, .stories-grid, .badges-grid, .buddies-grid, .marketplace-grid');
        
        grids.forEach(grid => {
            const cards = grid.children;
            Array.from(cards).forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }
    
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        counters.forEach(counter => observer.observe(counter));
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
    
    addSpecificAnimations(element) {
        const elementType = element.tagName.toLowerCase();
        const className = element.className;
        
        if (elementType === 'section') {
            element.classList.add('fade-in-up');
        } else if (className.includes('card')) {
            element.classList.add('slide-in-up');
        } else if (className.includes('stat')) {
            element.classList.add('scale-in');
        }
    }
}

// Parallax Effects
class ParallaxEffects {
    constructor() {
        this.setupParallaxElements();
        this.setupScrollListener();
    }
    
    setupParallaxElements() {
        this.parallaxElements = document.querySelectorAll('.floating-shape');
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        
        this.parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.1;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    }
}

// Loading Screen
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }
    
    init() {
        // Hide loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 1000);
        });
    }
    
    hideLoadingScreen() {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
    new ScrollProgressIndicator();
    new PageAnimations();
    new ParallaxEffects();
    new LoadingScreen();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.classList.add('animation-paused');
    } else {
        // Resume animations when page becomes visible
        document.body.classList.remove('animation-paused');
    }
});

// Export for use in other modules
window.NavigationManager = NavigationManager;
window.ScrollProgressIndicator = ScrollProgressIndicator;
window.PageAnimations = PageAnimations;
window.ParallaxEffects = ParallaxEffects;
window.LoadingScreen = LoadingScreen;