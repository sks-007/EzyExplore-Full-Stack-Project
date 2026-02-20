// Enhanced Features - Modern Functionality

// Dark Mode Manager
class DarkModeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.currentTheme);
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (this.themeToggle) {
            const icon = this.themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }
    }
}

// Enhanced Search Manager
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.filterChips = document.querySelectorAll('.filter-chip');
        this.activeFilters = new Set();
        this.init();
    }
    
    init() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleSearch();
            });
            
            // Real-time search
            this.searchInput.addEventListener('input', () => this.handleRealTimeSearch());
        }
        
        this.filterChips.forEach(chip => {
            chip.addEventListener('click', () => this.toggleFilter(chip));
        });
    }
    
    toggleFilter(chip) {
        const filter = chip.dataset.filter;
        chip.classList.toggle('active');
        
        if (chip.classList.contains('active')) {
            this.activeFilters.add(filter);
        } else {
            this.activeFilters.delete(filter);
        }
        
        this.handleSearch();
    }
    
    handleSearch() {
        if (!this.searchInput) return;
        
        const query = this.searchInput.value.trim();
        const filters = Array.from(this.activeFilters);
        
        // Show loading state
        this.showSearchLoading();
        
        // Simulate search (in real app, this would be an API call)
        setTimeout(() => {
            this.displaySearchResults(query, filters);
        }, 500);
    }
    
    handleRealTimeSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (this.searchInput.value.trim().length >= 2) {
                this.handleSearch();
            }
        }, 300);
    }
    
    showSearchLoading() {
        const grid = document.getElementById('destinations-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="loading-skeleton" style="height: 300px;"></div>
                <div class="loading-skeleton" style="height: 300px;"></div>
                <div class="loading-skeleton" style="height: 300px;"></div>
            `;
        }
    }
    
    displaySearchResults(query, filters) {
        // This would filter the actual destinations
        console.log('Searching for:', query, 'with filters:', filters);
        
        // Show notification
        this.showNotification(`Found results for "${query}"`, 'success');
        
        // Trigger explore.js to re-render with filters
        if (window.explore && window.explore.filterDestinations) {
            window.explore.filterDestinations(query, filters);
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Wishlist Manager
class WishlistManager {
    constructor() {
        this.wishlistBtn = document.getElementById('wishlist-btn');
        this.wishlistModal = document.getElementById('wishlist-modal');
        this.wishlistModalClose = document.getElementById('wishlist-modal-close');
        this.wishlistCount = document.getElementById('wishlist-count');
        this.wishlistItems = document.getElementById('wishlist-items');
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.API_URL = 'http://localhost:9000/api/wishlist';
        this.userId = 'guest'; // Can be updated with actual user ID from auth
        this.init();
    }
    
    init() {
        this.updateWishlistCount();
        
        if (this.wishlistBtn) {
            this.wishlistBtn.addEventListener('click', () => this.openModal());
        }
        
        if (this.wishlistModalClose) {
            this.wishlistModalClose.addEventListener('click', () => this.closeModal());
        }
        
        if (this.wishlistModal) {
            this.wishlistModal.addEventListener('click', (e) => {
                if (e.target === this.wishlistModal) this.closeModal();
            });
        }
    }
    
    async addToWishlist(destination) {
        if (!this.wishlist.find(item => item.id === destination.id)) {
            // Add to local storage first
            this.wishlist.push(destination);
            localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
            this.updateWishlistCount();
            
            // Sync with backend
            try {
                await fetch(this.API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: this.userId,
                        destinationId: destination.id,
                        destination: destination
                    })
                });
            } catch (error) {
                console.error('Failed to sync wishlist with backend:', error);
            }
            
            this.showNotification(`${destination.name} added to wishlist!`);
            return true;
        }
        return false;
    }

    isInWishlist(id) {
        return this.wishlist.some(item => String(item.id) === String(id));
    }
    
    async removeFromWishlist(id) {
        const item = this.wishlist.find(item => String(item.id) === String(id));
        if (!item) return null;
        
        // Remove from local storage
        this.wishlist = this.wishlist.filter(item => String(item.id) !== String(id));
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
        this.updateWishlistCount();
        this.renderWishlist();
        
        // Sync with backend
        try {
            await fetch(this.API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: this.userId,
                    destinationId: id
                })
            });
        } catch (error) {
            console.error('Failed to sync removal with backend:', error);
        }
        
        // Update any visible buttons in explore section
        this.updateExplorePageButtons(id);
        
        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { action: 'removed', id: id } 
        }));
        
        return item;
    }
    
    updateExplorePageButtons(removedId) {
        const buttons = document.querySelectorAll('.wishlist-add-btn');
        buttons.forEach(btn => {
            const btnData = btn.getAttribute('data-destination');
            if (btnData) {
                try {
                    const dest = JSON.parse(btnData.replace(/&apos;/g, "'"));
                    // Check if this button's destination was removed
                    if (String(dest.id) === String(removedId)) {
                        btn.innerHTML = '<i class="fas fa-heart"></i><span>Add to Wishlist</span>';
                        btn.classList.remove('in-wishlist');
                        btn.style.background = '';
                        btn.style.color = '';
                    }
                } catch (e) {
                    console.error('Error parsing button data:', e);
                }
            }
        });
    }
    
    updateWishlistCount() {
        if (this.wishlistCount) {
            this.wishlistCount.textContent = this.wishlist.length;
            this.wishlistCount.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }
    
    openModal() {
        if (this.wishlistModal) {
            this.wishlistModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.renderWishlist();
        }
    }
    
    closeModal() {
        if (this.wishlistModal) {
            this.wishlistModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    renderWishlist() {
        if (!this.wishlistItems) return;
        
        if (this.wishlist.length === 0) {
            this.wishlistItems.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart-broken"></i>
                    <p>Your wishlist is empty</p>
                    <p class="empty-subtitle">Start adding destinations you'd like to visit!</p>
                </div>
            `;
            return;
        }
        
        this.wishlistItems.innerHTML = this.wishlist.map(item => `
            <div class="wishlist-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                <div class="wishlist-item-content">
                    <div class="wishlist-item-title">${item.name}</div>
                    <div class="wishlist-item-location">
                        <i class="fas fa-map-marker-alt"></i> ${item.location}
                    </div>
                    <div class="wishlist-item-rating">
                        <span class="stars">${'★'.repeat(Math.floor(item.rating))}${'☆'.repeat(5 - Math.floor(item.rating))}</span>
                        <span>${item.rating}/5.0</span>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-view-btn" data-item-id="${item.id}" data-item-name="${item.name}">View Details</button>
                        <button class="wishlist-remove-btn" data-item-id="${item.id}">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners after rendering
        this.attachWishlistEventListeners();
    }

    attachWishlistEventListeners() {
        // View Details buttons
        const viewButtons = this.wishlistItems.querySelectorAll('.wishlist-view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-item-id');
                const item = this.wishlist.find(i => String(i.id) === String(itemId));
                if (item) {
                    this.closeModal();
                    this.showDestinationDetailsFromWishlist(item);
                }
            });
        });

        // Remove buttons
        const removeButtons = this.wishlistItems.querySelectorAll('.wishlist-remove-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.getAttribute('data-item-id');
                this.removeFromWishlistWithConfirmation(itemId);
            });
        });
    }

    removeFromWishlistWithConfirmation(id) {
        const item = this.wishlist.find(item => String(item.id) === String(id));
        if (!item) {
            console.log('Item not found in wishlist:', id);
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'plan-success-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'plan-success-popup cancel-popup';
        popup.innerHTML = `
            <i class="fas fa-heart-broken" style="color: #ef4444;"></i>
            <h3>Remove from Wishlist?</h3>
            <p>Are you sure you want to remove <strong>${item.name}</strong> from your wishlist?</p>
            <div class="cancel-popup-buttons">
                <button id="remove-confirm-btn" class="btn-danger">Yes, Remove</button>
                <button id="remove-no-btn" class="btn-secondary">No, Keep It</button>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        popup.querySelector('#remove-confirm-btn').addEventListener('click', () => {
            this.removeFromWishlist(id);
            popup.remove();
            overlay.remove();
            this.showRemovalSuccessPopup(item.name);
        });

        popup.querySelector('#remove-no-btn').addEventListener('click', () => {
            popup.remove();
            overlay.remove();
        });

        overlay.addEventListener('click', () => {
            popup.remove();
            overlay.remove();
        });
    }

    showRemovalSuccessPopup(itemName) {
        const overlay = document.createElement('div');
        overlay.className = 'plan-success-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'plan-success-popup';
        popup.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Removed Successfully!</h3>
            <p><strong>${itemName}</strong> has been removed from your wishlist.</p>
            <button id="removal-ok-btn">OK</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        const closePopup = () => {
            popup.remove();
            overlay.remove();
        };

        popup.querySelector('#removal-ok-btn').addEventListener('click', closePopup);
        overlay.addEventListener('click', closePopup);

        // Auto close after 2 seconds
        setTimeout(closePopup, 2000);
    }

    showDestinationDetailsFromWishlist(item) {
        // Navigate to explore section
        window.location.hash = 'explore';
        
        // Wait for section to load, then show modal
        setTimeout(() => {
            if (window.exploreManager) {
                // Create destination object matching the explore format
                const destination = {
                    name: item.name,
                    description: `Explore the beauty of ${item.name}`,
                    image: item.image,
                    rating: item.rating,
                    eco: false
                };
                window.exploreManager.showDestinationDetails(destination);
            }
        }, 300);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-heart"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Scroll to Top
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scroll-to-top');
        this.init();
    }
    
    init() {
        if (this.button) {
            this.button.addEventListener('click', () => this.scrollToTop());
        }
        
        window.addEventListener('scroll', () => this.updateButtonVisibility());
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    updateButtonVisibility() {
        if (this.button) {
            if (window.scrollY > 300) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.darkModeManager = new DarkModeManager();
    window.searchManager = new SearchManager();
    window.wishlistManager = new WishlistManager();
    window.scrollToTop = new ScrollToTop();
});

// Export for use in other scripts
window.EnhancedFeatures = {
    DarkModeManager,
    SearchManager,
    WishlistManager,
    ScrollToTop
};
