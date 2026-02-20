/**
 * Hash Navigation Manager
 * Handles client-side hash-based routing for single-page navigation
 * - Updates URL without page reload
 * - Supports browser back/forward buttons
 * - Restores default state when hash is removed
 */

class HashNavigationManager {
    constructor() {
        this.currentHash = '';
        this.previousHash = '';
        this.defaultStates = {
            explore: 'states',      // Default filter for explore section
            wishlist: 'saved',      // Default view for wishlist
            heritage: 'monuments',  // Default filter for heritage
            reviews: 'recent',      // Default sort for reviews
            tips: 'popular',        // Default tips category
            blog: 'latest'          // Default blog filter
        };
        
        this.hashHandlers = {};
        this.init();
    }
    
    init() {
        // Listen to hash changes (back/forward buttons, manual hash changes)
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Handle initial hash on page load
        window.addEventListener('DOMContentLoaded', () => this.handleHashChange());
        
        console.log('✅ Hash Navigation Manager initialized');
    }
    
    /**
     * Navigate to a section with optional hash
     * @param {string} section - The main section (e.g., 'explore', 'wishlist')
     * @param {string} hash - Optional hash parameter (e.g., 'mountains', 'beaches')
     */
    goToSection(section, hash = '') {
        // Store previous hash
        this.previousHash = this.currentHash;
        
        // Construct new hash
        const newHash = hash ? `${section}#${hash}` : section;
        
        // Update URL without reloading page
        window.location.hash = newHash;
        
        console.log(`📍 Navigating to: /${section}${hash ? '#' + hash : ''}`);
    }
    
    /**
     * Handle hash change events
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1); // Remove the '#' prefix
        this.previousHash = this.currentHash;
        this.currentHash = hash;
        
        if (hash === '') {
            // No hash - show home/default view
            this.loadDefaultView();
            return;
        }
        
        // Parse hash into section and subsection
        const [section, subsection] = hash.split('#');
        
        console.log(`🔄 Hash changed to: ${hash} (section: ${section}, subsection: ${subsection || 'none'})`);
        
        // Route to appropriate handler
        this.routeToSection(section, subsection);
    }
    
    /**
     * Route to the appropriate section handler
     * @param {string} section - Main section identifier
     * @param {string} subsection - Optional subsection identifier
     */
    routeToSection(section, subsection) {
        // Scroll to section first
        this.scrollToSection(section);
        
        // Update navigation active state
        this.updateActiveNavLink(section);
        
        // Handle section-specific logic
        switch(section) {
            case 'home':
                this.handleHomeSection();
                break;
                
            case 'explore':
                this.handleExploreSection(subsection);
                break;
                
            case 'wishlist':
                this.handleWishlistSection(subsection);
                break;
                
            case 'heritage':
                this.handleHeritageSection(subsection);
                break;
                
            case 'reviews':
                this.handleReviewsSection(subsection);
                break;
                
            case 'tips':
                this.handleTipsSection(subsection);
                break;
                
            case 'blog':
                this.handleBlogSection(subsection);
                break;
                
            case 'about':
                this.handleAboutSection();
                break;
                
            default:
                console.warn(`⚠️ Unknown section: ${section}`);
                this.loadDefaultView();
        }
        
        // Call custom handlers if registered
        if (this.hashHandlers[section]) {
            this.hashHandlers[section](subsection);
        }
    }
    
    /**
     * Register a custom hash handler for a section
     * @param {string} section - Section identifier
     * @param {function} handler - Handler function
     */
    registerHandler(section, handler) {
        this.hashHandlers[section] = handler;
        console.log(`✅ Registered handler for section: ${section}`);
    }
    
    /**
     * Handle Home section
     */
    handleHomeSection() {
        console.log('🏠 Loading home section');
        // Home section logic here
    }
    
    /**
     * Handle Explore section with filters
     * @param {string} filter - Filter type (mountains, beaches, states, heritage)
     */
    handleExploreSection(filter) {
        const validFilters = ['mountains', 'beaches', 'states', 'heritage', 'local-buddies'];
        const activeFilter = filter && validFilters.includes(filter) 
            ? filter 
            : this.defaultStates.explore;
        
        console.log(`🗺️ Loading explore section with filter: ${activeFilter}`);
        
        // Update filter tabs
        this.updateFilterTabs(activeFilter);
        
        // Filter destinations
        this.filterDestinations(activeFilter);
    }
    
    /**
     * Handle Wishlist section
     * @param {string} view - View type (saved, planned, visited)
     */
    handleWishlistSection(view) {
        const activeView = view || this.defaultStates.wishlist;
        console.log(`❤️ Loading wishlist section with view: ${activeView}`);
        
        // Wishlist logic here
        // You can implement different views: saved items, planned visits, etc.
    }
    
    /**
     * Handle Heritage section
     * @param {string} filter - Heritage filter (monuments, temples, forts)
     */
    handleHeritageSection(filter) {
        const activeFilter = filter || this.defaultStates.heritage;
        console.log(`🏛️ Loading heritage section with filter: ${activeFilter}`);
        
        // Heritage filtering logic here
    }
    
    /**
     * Handle Reviews section
     * @param {string} sort - Sort type (recent, popular, rating)
     */
    handleReviewsSection(sort) {
        const activeSort = sort || this.defaultStates.reviews;
        console.log(`⭐ Loading reviews section with sort: ${activeSort}`);
        
        // Reviews sorting logic here
    }
    
    /**
     * Handle Tips section
     * @param {string} category - Tips category
     */
    handleTipsSection(category) {
        const activeCategory = category || this.defaultStates.tips;
        console.log(`💡 Loading tips section with category: ${activeCategory}`);
        
        // Tips filtering logic here
    }
    
    /**
     * Handle Blog section
     * @param {string} filter - Blog filter
     */
    handleBlogSection(filter) {
        const activeFilter = filter || this.defaultStates.blog;
        console.log(`📝 Loading blog section with filter: ${activeFilter}`);
        
        // Blog filtering logic here
    }
    
    /**
     * Handle About section
     */
    handleAboutSection() {
        console.log('ℹ️ Loading about section');
        // About section logic here
    }
    
    /**
     * Update filter tabs active state
     * @param {string} activeFilter - Currently active filter
     */
    updateFilterTabs(activeFilter) {
        const filterTabs = document.querySelectorAll('.filter-tab');
        
        filterTabs.forEach(tab => {
            const category = tab.getAttribute('data-category') || 
                           (tab.id === 'local-buddies-btn' ? 'local-buddies' : '');
            
            if (category === activeFilter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    /**
     * Filter destinations based on category
     * @param {string} category - Category to filter by
     */
    filterDestinations(category) {
        const destinationsGrid = document.getElementById('destinations-grid');
        if (!destinationsGrid) return;
        
        const allCards = destinationsGrid.querySelectorAll('.destination-card');
        
        // Show all if category is 'states' or invalid
        if (category === 'states' || !category) {
            allCards.forEach(card => {
                card.style.display = '';
                card.classList.remove('hidden');
            });
            return;
        }
        
        // Filter by category
        allCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (cardCategory === category || category === 'states') {
                card.style.display = '';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        console.log(`🔍 Filtered destinations by: ${category}`);
    }
    
    /**
     * Update active navigation link
     * @param {string} section - Active section
     */
    updateActiveNavLink(section) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkSection = link.getAttribute('data-section') || 
                              link.getAttribute('href')?.slice(1);
            
            if (linkSection === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Scroll to section smoothly
     * @param {string} sectionId - ID of section to scroll to
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        if (section) {
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
    
    /**
     * Load default view (when no hash present)
     */
    loadDefaultView() {
        console.log('🏠 Loading default view (home)');
        
        // Reset to home section
        this.updateActiveNavLink('home');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Reset all filters to default
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            const category = tab.getAttribute('data-category');
            if (category === 'states') {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        // Show all destinations
        this.filterDestinations('states');
    }
    
    /**
     * Get current hash information
     * @returns {Object} Current hash details
     */
    getCurrentHash() {
        const hash = window.location.hash.slice(1);
        const [section, subsection] = hash.split('#');
        
        return {
            full: hash,
            section: section || 'home',
            subsection: subsection || null
        };
    }
    
    /**
     * Remove hash and return to default state
     */
    removeHash() {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        this.loadDefaultView();
    }
}

// Initialize the hash navigation manager
const hashNav = new HashNavigationManager();

// Make it globally accessible
window.hashNav = hashNav;

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HashNavigationManager;
}
