// Enhanced Explore Section - Loading from data.json

class ExploreManager {
    constructor() {
        this.filterTabs = document.querySelectorAll('.filter-tab');
        this.destinationsGrid = document.getElementById('destinations-grid');
        this.viewMoreBtn = document.getElementById('view-more-btn');
        this.currentCategory = 'states';
        this.visibleCount = 6;
        this.isLoading = false;
        
        // Will be populated from JSON
        this.destinationsData = {
            states: [],
            mountains: [],
            beaches: [],
            heritage: []
        };
        
        this.init();
    }
    
    async init() {
        await this.loadDataFromJSON();
        this.setupEventListeners();
        this.loadDestinations('states');
        this.setupSearchFunctionality();
        this.setupAnimations();
        this.setupWishlistSync();
    }
    
    setupWishlistSync() {
        // Listen for wishlist updates from other components
        window.addEventListener('wishlistUpdated', (e) => {
            console.log('Wishlist updated, refreshing buttons...', e.detail);
            this.refreshAllWishlistButtons();
        });
    }
    
    refreshAllWishlistButtons() {
        const buttons = document.querySelectorAll('.wishlist-add-btn');
        buttons.forEach(btn => {
            const btnData = btn.getAttribute('data-destination');
            if (btnData) {
                try {
                    const dest = JSON.parse(btnData.replace(/&apos;/g, "'"));
                    const category = btn.closest('.destination-card')?.dataset.category || this.currentCategory;
                    const index = btn.closest('.destination-card')?.dataset.index || 0;
                    const destinationId = `${category}-${index}`;
                    this.updateWishlistButtonState(btn, destinationId);
                } catch (e) {
                    console.error('Error parsing button data:', e);
                }
            }
        });
    }
    
    async loadDataFromJSON() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            
            // Map the explore data to categories
            if (data.explore && Array.isArray(data.explore)) {
                data.explore.forEach(item => {
                    const category = item.category;
                    if (this.destinationsData[category]) {
                        this.destinationsData[category].push({
                            name: item.title,
                            description: item.description,
                            image: item.image,
                            rating: item.rating || 4.5,
                            eco: item.eco || false
                        });
                    }
                });
            }
            
            console.log('Data loaded successfully:', this.destinationsData);
        } catch (error) {
            console.error('Error loading data.json:', error);
            // Fallback to show error message
            this.destinationsGrid.innerHTML = '<p style="color: red; text-align: center;">Error loading destinations. Please check console.</p>';
        }
    }
    
    setupEventListeners() {
        this.filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.target.closest('.filter-tab').getAttribute('data-category');
                // Skip if no category (e.g., Local Buddies button)
                if (!category) return;
                this.switchCategory(category);
            });
        });
        
        if (this.viewMoreBtn) {
            this.viewMoreBtn.addEventListener('click', () => {
                this.loadMoreDestinations();
            });
        }
    }
    
    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (!searchInput || !searchBtn) {
            console.warn('Search elements not found');
            return;
        }
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchDestinations(e.target.value);
            }, 300);
        });
        
        searchBtn.addEventListener('click', () => {
            this.searchDestinations(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchDestinations(searchInput.value);
            }
        });
    }
    
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.destination-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    switchCategory(category) {
        if (this.currentCategory === category) return;
        
        this.filterTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-category') === category) {
                tab.classList.add('active');
            }
        });
        
        this.currentCategory = category;
        this.visibleCount = 6;
        
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.value = '';
        
        this.loadDestinations(category, true);
    }
    
    loadDestinations(category, animate = false) {
        const destinations = this.destinationsData[category] || [];
        const visibleDestinations = destinations.slice(0, this.visibleCount);
        
        if (animate) {
            this.animateOut(() => {
                this.renderDestinations(visibleDestinations);
                this.animateIn();
            });
        } else {
            this.renderDestinations(visibleDestinations);
        }
        
        this.updateViewMoreButton(destinations.length);
    }
    
    renderDestinations(destinations) {
        this.destinationsGrid.innerHTML = '';
        
        if (destinations.length === 0) {
            this.destinationsGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No destinations found in this category.</p>';
            return;
        }
        
        destinations.forEach((destination, index) => {
            const card = this.createDestinationCard(destination, index);
            this.destinationsGrid.appendChild(card);
        });
    }
    
    createDestinationCard(destination, index) {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.dataset.category = this.currentCategory;
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="destination-image-container">
                <img src="${destination.image}" alt="${destination.name}" class="destination-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop'">
                <div class="destination-overlay">
                    <div class="destination-rating">
                        <span class="stars">${'★'.repeat(Math.floor(destination.rating))}${'☆'.repeat(5 - Math.floor(destination.rating))}</span>
                        <span class="rating-number">${destination.rating}</span>
                    </div>
                    ${destination.eco ? '<div class="eco-badge">🌱 Eco-Friendly</div>' : ''}
                </div>
            </div>
            <div class="destination-content">
                <h3 class="destination-name">${destination.name}</h3>
                <p class="destination-description">${destination.description}</p>
                <div class="destination-actions">
                    <button class="btn-primary btn-sm explore-btn">
                        <i class="fas fa-eye"></i>
                        <span>Explore</span>
                    </button>
                    <button class="btn-secondary btn-sm wishlist-add-btn" data-destination='${JSON.stringify(destination).replace(/'/g, "&apos;")}'>
                        <i class="fas fa-heart"></i>
                        <span>Add to Wishlist</span>
                    </button>
                </div>
            </div>
        `;
        
        const wishlistBtn = card.querySelector('.wishlist-add-btn');
        if (wishlistBtn) {
            // Check if already in wishlist and update button state
            const destinationId = `${this.currentCategory}-${index}`;
            this.updateWishlistButtonState(wishlistBtn, destinationId);

            wishlistBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dest = JSON.parse(e.currentTarget.getAttribute('data-destination').replace(/&apos;/g, "'"));
                const itemId = `${this.currentCategory}-${index}`;
                
                if (window.wishlistManager) {
                    const isInWishlist = window.wishlistManager.isInWishlist(itemId);
                    
                    if (isInWishlist) {
                        // Remove from wishlist
                        window.wishlistManager.removeFromWishlist(itemId);
                        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Add to Wishlist</span>';
                        wishlistBtn.classList.remove('in-wishlist');
                        wishlistBtn.style.background = '';
                        wishlistBtn.style.color = '';
                        this.showWishlistPopup('Removed from Wishlist', dest.name, false);
                    } else {
                        // Add to wishlist
                        const added = window.wishlistManager.addToWishlist({
                            id: itemId,
                            name: dest.name,
                            location: this.currentCategory,
                            image: dest.image,
                            rating: dest.rating
                        });
                        
                        if (added) {
                            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Added to Wishlist</span>';
                            wishlistBtn.classList.add('in-wishlist');
                            wishlistBtn.style.background = '#10b981';
                            wishlistBtn.style.color = 'white';
                            this.showWishlistPopup('Added to Wishlist', dest.name, true);
                        }
                    }
                }
            });
        }

        // Bind explore button to show the same destination details as card click
        const exploreBtn = card.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showDestinationDetails(destination);
            });
        }
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.showDestinationDetails(destination);
            }
        });
        
        return card;
    }
    
    updateWishlistButtonState(wishlistBtn, destinationId) {
        if (window.wishlistManager && window.wishlistManager.isInWishlist(destinationId)) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Added to Wishlist</span>';
            wishlistBtn.classList.add('in-wishlist');
            wishlistBtn.style.background = '#10b981';
            wishlistBtn.style.color = 'white';
        } else {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i><span>Add to Wishlist</span>';
            wishlistBtn.classList.remove('in-wishlist');
            wishlistBtn.style.background = '';
            wishlistBtn.style.color = '';
        }
    }
    
    showDestinationDetails(destination) {
        const modal = document.createElement('div');
        modal.className = 'modal destination-modal active';
        modal.innerHTML = `
            <div class="modal-content destination-details">
                <div class="modal-header">
                    <h2 class="modal-title">${destination.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="destination-detail-image">
                        <img src="${destination.image}" alt="${destination.name}">
                        ${destination.eco ? '<div class="eco-badge-large">🌱 Eco-Friendly Destination</div>' : ''}
                    </div>
                    <div class="destination-detail-content">
                        <p class="destination-detail-description">${destination.description}</p>
                        <div class="destination-rating-detail">
                            <span class="stars">${'★'.repeat(Math.floor(destination.rating))}${'☆'.repeat(5 - Math.floor(destination.rating))}</span>
                            <span class="rating-number">${destination.rating}/5.0</span>
                        </div>
                        <div class="destination-features">
                            <div class="feature-tag">🏞️ Scenic Views</div>
                            <div class="feature-tag">📸 Photo Spot</div>
                            <div class="feature-tag">🎒 Adventure</div>
                            ${destination.eco ? '<div class="feature-tag eco-tag">🌱 Eco-Friendly</div>' : ''}
                        </div>
                        <div class="destination-actions-detail">
                            <button class="btn-primary">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Plan Visit</span>
                            </button>
                            <button class="btn-secondary">
                                <i class="fas fa-share"></i>
                                <span>Share</span>
                            </button>
                            <button class="btn-outline">
                                <i class="fas fa-users"></i>
                                <span>Find Local Buddy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Plan Visit: show date input and confirm button
        (function bindPlanAndShareButtons() {
            const actionsDetail = modal.querySelector('.destination-actions-detail');
            if (!actionsDetail) return;

            const planBtn = actionsDetail.querySelector('button:nth-child(1)');
            const shareBtn = actionsDetail.querySelector('button:nth-child(2)');

            function formatDate(d) {
                return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            }

            function getTodayDateString() {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            async function saveVisitToBackend(destinationName, selectedDate) {
                try {
                    const userId = localStorage.getItem('userId') || 'guest';
                    
                    console.log('Saving visit:', { destination: destinationName, selectedDate, userId });
                    
                    const response = await fetch('http://localhost:9000/api/visit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            destination: destinationName,
                            selectedDate: selectedDate,
                            userId: userId
                        })
                    });

                    const data = await response.json();
                    console.log('Backend response:', data);
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Failed to save visit');
                    }
                    
                    // Save to localStorage
                    savePlannedVisitToLocalStorage(destinationName, selectedDate);
                    
                    return data;
                } catch (error) {
                    console.error('Error saving visit:', error);
                    throw error;
                }
            }

            function savePlannedVisitToLocalStorage(destinationName, selectedDate) {
                let plannedVisits = JSON.parse(localStorage.getItem('plannedVisits') || '{}');
                plannedVisits[destinationName] = {
                    date: selectedDate,
                    plannedAt: new Date().toISOString()
                };
                localStorage.setItem('plannedVisits', JSON.stringify(plannedVisits));
                console.log('Saved to localStorage:', plannedVisits);
            }

            function getPlannedVisitFromLocalStorage(destinationName) {
                let plannedVisits = JSON.parse(localStorage.getItem('plannedVisits') || '{}');
                return plannedVisits[destinationName];
            }

            function removePlannedVisitFromLocalStorage(destinationName) {
                let plannedVisits = JSON.parse(localStorage.getItem('plannedVisits') || '{}');
                delete plannedVisits[destinationName];
                localStorage.setItem('plannedVisits', JSON.stringify(plannedVisits));
                console.log('Removed from localStorage:', destinationName);
            }

            function showSuccessPopup(destinationName, selectedDate) {
                const overlay = document.createElement('div');
                overlay.className = 'plan-success-overlay';
                
                const popup = document.createElement('div');
                popup.className = 'plan-success-popup';
                popup.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Visit Planned Successfully!</h3>
                    <p>Your visit to <strong>${destinationName}</strong> has been scheduled for <strong>${formatDate(new Date(selectedDate))}</strong></p>
                    <button id="success-ok-btn">OK</button>
                `;

                document.body.appendChild(overlay);
                document.body.appendChild(popup);

                popup.querySelector('#success-ok-btn').addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                    showPlannedDateBadge(selectedDate);
                });

                overlay.addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                    showPlannedDateBadge(selectedDate);
                });
            }

            function showCancelConfirmationPopup(destinationName, onConfirm) {
                const overlay = document.createElement('div');
                overlay.className = 'plan-success-overlay';
                
                const popup = document.createElement('div');
                popup.className = 'plan-success-popup cancel-popup';
                popup.innerHTML = `
                    <i class="fas fa-times-circle"></i>
                    <h3>Cancel Trip?</h3>
                    <p>Are you sure you want to cancel your trip to <strong>${destinationName}</strong>?</p>
                    <div class="cancel-popup-buttons">
                        <button id="cancel-confirm-btn" class="btn-danger">Yes, Cancel Trip</button>
                        <button id="cancel-no-btn" class="btn-secondary">No, Keep It</button>
                    </div>
                `;

                document.body.appendChild(overlay);
                document.body.appendChild(popup);

                popup.querySelector('#cancel-confirm-btn').addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                    onConfirm();
                    showCancellationSuccessPopup(destinationName);
                });

                popup.querySelector('#cancel-no-btn').addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                });

                overlay.addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                });
            }

            function showCancellationSuccessPopup(destinationName) {
                const overlay = document.createElement('div');
                overlay.className = 'plan-success-overlay';
                
                const popup = document.createElement('div');
                popup.className = 'plan-success-popup';
                popup.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Trip Cancelled Successfully!</h3>
                    <p>Your trip to <strong>${destinationName}</strong> has been cancelled.</p>
                    <button id="cancel-success-ok-btn">OK</button>
                `;

                document.body.appendChild(overlay);
                document.body.appendChild(popup);

                popup.querySelector('#cancel-success-ok-btn').addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                });

                overlay.addEventListener('click', () => {
                    popup.remove();
                    overlay.remove();
                });
            }

            function showPlannedDateBadge(selectedDate) {
                let badge = modal.querySelector('.planned-date-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'planned-date-badge';
                    const actionsDetail = modal.querySelector('.destination-actions-detail');
                    if (actionsDetail) {
                        actionsDetail.parentNode.insertBefore(badge, actionsDetail);
                    }
                }
                badge.innerHTML = `
                    <i class="fas fa-calendar-check"></i>
                    <span>Planned for: ${formatDate(new Date(selectedDate))}</span>
                    <button class="cancel-trip-btn" title="Cancel Trip">
                        <i class="fas fa-times"></i>
                    </button>
                `;

                // Add cancel functionality
                const cancelBtn = badge.querySelector('.cancel-trip-btn');
                cancelBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showCancelConfirmationPopup(destination.name, () => {
                        removePlannedVisitFromLocalStorage(destination.name);
                        badge.remove();
                    });
                });
            }

            // Check if there's already a planned visit for this destination
            function checkExistingPlannedVisit() {
                const plannedVisit = getPlannedVisitFromLocalStorage(destination.name);
                if (plannedVisit && plannedVisit.date) {
                    showPlannedDateBadge(plannedVisit.date);
                }
            }

            // Check on modal open
            checkExistingPlannedVisit();

            function showPlanPopup() {
                if (modal.querySelector('.plan-visit-popup')) return;

                const popup = document.createElement('div');
                popup.className = 'plan-visit-popup';
                popup.innerHTML = `
                    <h3>Plan Your Visit</h3>
                    <div class="plan-date-input-container">
                        <label for="visit-date-input">Select a date for your visit:</label>
                        <input type="date" id="visit-date-input" min="${getTodayDateString()}">
                    </div>
                    <button class="plan-confirm-btn" id="plan-confirm-btn" disabled>
                        <i class="fas fa-check"></i>
                        <span>Confirm Visit</span>
                    </button>
                    <button class="plan-close" id="plan-close-btn">Close</button>
                `;

                const modalContent = modal.querySelector('.modal-content');
                modalContent.appendChild(popup);

                const dateInput = popup.querySelector('#visit-date-input');
                const confirmBtn = popup.querySelector('#plan-confirm-btn');
                const closeBtn = popup.querySelector('#plan-close-btn');

                dateInput.addEventListener('change', () => {
                    const selectedDate = dateInput.value;
                    const today = getTodayDateString();
                    
                    if (selectedDate && selectedDate >= today) {
                        confirmBtn.disabled = false;
                        confirmBtn.classList.add('active');
                    } else {
                        confirmBtn.disabled = true;
                        confirmBtn.classList.remove('active');
                    }
                });

                // Add Enter key support
                dateInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (!confirmBtn.disabled) {
                            confirmBtn.click();
                        }
                    }
                });

                // Shared function to save visit
                async function saveVisit() {
                    const selectedDate = dateInput.value;
                    
                    if (selectedDate) {
                        confirmBtn.disabled = true;
                        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Saving...</span>';
                        
                        try {
                            await saveVisitToBackend(destination.name, selectedDate);
                            popup.remove();
                            showSuccessPopup(destination.name, selectedDate);
                        } catch (error) {
                            confirmBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i><span>Error - Try Again</span>';
                            confirmBtn.style.background = '#ef4444';
                            
                            const errorToast = document.createElement('div');
                            errorToast.className = 'explore-toast error';
                            errorToast.textContent = 'Failed to save visit. Check console for details.';
                            document.body.appendChild(errorToast);
                            setTimeout(() => errorToast.classList.add('visible'), 10);
                            setTimeout(() => {
                                errorToast.classList.remove('visible');
                                setTimeout(() => errorToast.remove(), 300);
                            }, 3000);
                            
                            setTimeout(() => {
                                confirmBtn.disabled = false;
                                confirmBtn.innerHTML = '<i class="fas fa-check"></i><span>Confirm Visit</span>';
                                confirmBtn.style.background = '';
                            }, 2000);
                        }
                    }
                }

                confirmBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    await saveVisit();
                });

                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    popup.remove();
                });
            }

            if (planBtn) {
                planBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showPlanPopup();
                });
            }

            if (shareBtn) {
                shareBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    const shareUrl = window.location.origin + window.location.pathname + '?dest=' + encodeURIComponent(destination.name);
                    // Try Clipboard API first
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(shareUrl);
                        } else {
                            // Fallback
                            const ta = document.createElement('textarea');
                            ta.value = shareUrl;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            ta.remove();
                        }
                        showToast('Link copied to clipboard');
                    } catch (err) {
                        console.error('Copy failed', err);
                        showToast('Unable to copy link');
                    }
                });
            }

            // Find Local Buddy button handler
            const findBuddyBtn = actionsDetail.querySelector('button:nth-child(3)');
            if (findBuddyBtn) {
                findBuddyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Open Local Buddies modal
                    const localBuddiesModal = document.getElementById('local-buddies-modal');
                    if (localBuddiesModal) {
                        // Trigger the local buddies modal
                        if (window.openLocalBuddiesModal) {
                            window.openLocalBuddiesModal();
                        } else {
                            // Fallback: manually trigger
                            localBuddiesModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                            // Load buddies if function exists
                            if (window.loadLocalBuddies) {
                                window.loadLocalBuddies();
                            }
                        }
                    }
                });
            }

            // small toast helper
            function showToast(msg, duration = 1800) {
                const t = document.createElement('div');
                t.className = 'explore-toast';
                t.textContent = msg;
                document.body.appendChild(t);
                setTimeout(() => {
                    t.classList.add('visible');
                }, 10);
                setTimeout(() => {
                    t.classList.remove('visible');
                    setTimeout(() => t.remove(), 300);
                }, duration);
            }
        })();
    }

    showWishlistPopup(title, destinationName, isAdded) {
        const overlay = document.createElement('div');
        overlay.className = 'plan-success-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'plan-success-popup';
        
        const icon = isAdded ? 'fa-check-circle' : 'fa-times-circle';
        const bgColor = isAdded ? '#10b981' : '#ef4444';
        
        popup.innerHTML = `
            <i class="fas ${icon}" style="color: ${bgColor};"></i>
            <h3>${title}</h3>
            <p><strong>${destinationName}</strong> has been ${isAdded ? 'added to' : 'removed from'} your wishlist.</p>
            <button id="wishlist-popup-ok-btn" style="background: ${bgColor};">OK</button>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(popup);

        const closePopup = () => {
            popup.remove();
            overlay.remove();
        };

        popup.querySelector('#wishlist-popup-ok-btn').addEventListener('click', closePopup);
        overlay.addEventListener('click', closePopup);

        // Auto close after 2 seconds
        setTimeout(closePopup, 2000);
    }
    
    loadMoreDestinations() {
        const destinations = this.destinationsData[this.currentCategory] || [];
        this.visibleCount += 6;
        
        if (this.visibleCount >= destinations.length) {
            this.viewMoreBtn.style.display = 'none';
        }
        
        this.loadDestinations(this.currentCategory);
    }
    
    updateViewMoreButton(totalCount) {
        if (!this.viewMoreBtn) return;
        
        if (this.visibleCount >= totalCount) {
            this.viewMoreBtn.style.display = 'none';
        } else {
            this.viewMoreBtn.style.display = 'block';
            this.viewMoreBtn.innerHTML = `
                <span class="btn-text">View More (${totalCount - this.visibleCount} remaining)</span>
                <i class="fas fa-arrow-down"></i>
            `;
        }
    }
    
    searchDestinations(query) {
        if (!query.trim()) {
            this.loadDestinations(this.currentCategory);
            return;
        }
        
        const destinations = this.destinationsData[this.currentCategory] || [];
        const filteredDestinations = destinations.filter(dest => 
            dest.name.toLowerCase().includes(query.toLowerCase()) ||
            dest.description.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderDestinations(filteredDestinations.slice(0, this.visibleCount));
        this.updateViewMoreButton(filteredDestinations.length);
    }
    
    animateOut(callback) {
        const cards = this.destinationsGrid.children;
        Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-out');
            }, index * 50);
        });
        
        setTimeout(callback, cards.length * 50 + 200);
    }
    
    animateIn() {
        const cards = this.destinationsGrid.children;
        Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.exploreManager = new ExploreManager();
    window.explore = window.exploreManager;
});

window.ExploreManager = ExploreManager;