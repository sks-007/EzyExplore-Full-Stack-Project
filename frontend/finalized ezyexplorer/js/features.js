// Enhanced Features - EzyExplorer

// Expense Splitter Feature
class ExpenseSplitter {
    constructor() {
        this.expenseList = document.getElementById('expense-list');
        this.addExpenseBtn = document.getElementById('add-expense-btn');
        this.expenses = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addSampleExpense();
    }
    
    setupEventListeners() {
        this.addExpenseBtn.addEventListener('click', () => {
            this.addNewExpense();
        });
        
        // Handle expense changes
        this.expenseList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' || e.target.type === 'number' || e.target.type === 'text') {
                this.updateSummary();
            }
        });
        
        // Handle expense removal
        this.expenseList.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-expense') || e.target.closest('.remove-expense')) {
                const expenseItem = e.target.closest('.expense-item');
                expenseItem.remove();
                this.updateSummary();
            }
        });
    }
    
    addSampleExpense() {
        // Sample expense is already in HTML
        this.updateSummary();
    }
    
    addNewExpense() {
        const expenseHtml = `
            <div class="expense-item">
                <div class="expense-info">
                    <input type="text" placeholder="Expense description" value="New Expense">
                    <input type="number" placeholder="Amount (₹)" value="0">
                </div>
                <div class="expense-members">
                    <label><input type="checkbox" checked> Rahul</label>
                    <label><input type="checkbox" checked> Priya</label>
                    <label><input type="checkbox" checked> Ankit</label>
                    <label><input type="checkbox"> Suresh</label>
                </div>
                <button class="remove-expense">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        this.expenseList.insertAdjacentHTML('beforeend', expenseHtml);
        this.updateSummary();
    }
    
    updateSummary() {
        const expenseItems = this.expenseList.querySelectorAll('.expense-item');
        let totalAmount = 0;
        let totalMembers = 0;
        let memberCount = 0;
        
        expenseItems.forEach(item => {
            const amountInput = item.querySelector('input[type="number"]');
            const checkedBoxes = item.querySelectorAll('input[type="checkbox"]:checked');
            
            if (amountInput && checkedBoxes.length > 0) {
                const amount = parseFloat(amountInput.value) || 0;
                totalAmount += amount;
                totalMembers += amount;
                memberCount = Math.max(memberCount, checkedBoxes.length);
            }
        });
        
        const perPerson = memberCount > 0 ? Math.round(totalAmount / memberCount) : 0;
        
        // Update summary display
        const summaryItems = document.querySelectorAll('.summary-item');
        if (summaryItems.length >= 3) {
            summaryItems[0].querySelector('span:last-child').textContent = `₹${totalAmount.toLocaleString()}`;
            summaryItems[1].querySelector('span:last-child').textContent = `${memberCount} people`;
            summaryItems[2].querySelector('span:last-child').textContent = `₹${perPerson.toLocaleString()}`;
        }
    }
}

// Eco-Explore Mode
class EcoExploreMode {
    constructor() {
        this.ecoModeToggle = document.getElementById('eco-mode');
        this.destinationsGrid = document.getElementById('destinations-grid');
        this.isEcoMode = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.ecoModeToggle) {
            this.ecoModeToggle.addEventListener('change', (e) => {
                this.toggleEcoMode(e.target.checked);
            });
        }
    }
    
    toggleEcoMode(enabled) {
        this.isEcoMode = enabled;
        
        if (enabled) {
            this.highlightEcoDestinations();
            this.showEcoNotification();
        } else {
            this.removeEcoHighlights();
        }
    }
    
    highlightEcoDestinations() {
        const cards = this.destinationsGrid.querySelectorAll('.destination-card');
        cards.forEach(card => {
            // Add eco-friendly badge to certain destinations
            const destinationName = card.querySelector('.destination-name').textContent.toLowerCase();
            const ecoDestinations = ['kerala', 'himachal', 'sikkim', 'meghalaya', 'goa'];
            
            if (ecoDestinations.some(dest => destinationName.includes(dest))) {
                card.classList.add('eco-friendly');
                
                // Add eco badge if not already present
                if (!card.querySelector('.eco-badge')) {
                    const ecoBadge = document.createElement('div');
                    ecoBadge.className = 'eco-badge';
                    ecoBadge.innerHTML = '🌱 Eco-Friendly';
                    card.querySelector('.destination-overlay').appendChild(ecoBadge);
                }
            }
        });
    }
    
    removeEcoHighlights() {
        const cards = this.destinationsGrid.querySelectorAll('.destination-card');
        cards.forEach(card => {
            card.classList.remove('eco-friendly');
            const ecoBadge = card.querySelector('.eco-badge');
            if (ecoBadge) {
                ecoBadge.remove();
            }
        });
    }
    
    showEcoNotification() {
        const notification = document.createElement('div');
        notification.className = 'eco-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-leaf"></i>
                <span>Eco-Explore Mode Active! Showing sustainable destinations.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Story Upload Feature
class StoryUpload {
    constructor() {
        this.uploadBtn = document.querySelector('.btn-upload');
        this.storiesGrid = document.querySelector('.stories-grid');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => {
                this.showUploadModal();
            });
        }
    }
    
    showUploadModal() {
        const modal = document.createElement('div');
        modal.className = 'modal story-upload-modal active';
        modal.innerHTML = `
            <div class="modal-content story-upload-content">
                <div class="modal-header">
                    <h2 class="modal-title">Share Your Travel Story</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form class="story-upload-form">
                        <div class="form-group">
                            <label for="story-image">Upload Photo</label>
                            <input type="file" id="story-image" accept="image/*" required>
                            <div class="image-preview"></div>
                        </div>
                        <div class="form-group">
                            <label for="story-location">Location</label>
                            <input type="text" id="story-location" placeholder="Where did you visit?" required>
                        </div>
                        <div class="form-group">
                            <label for="story-text">Your Story</label>
                            <textarea id="story-text" placeholder="Share your experience in 2-3 lines..." rows="3" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary full-width">
                            <i class="fas fa-share"></i>
                            <span>Share Story</span>
                        </button>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal functionality
        this.setupUploadModal(modal);
    }
    
    setupUploadModal(modal) {
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Image preview
        const imageInput = modal.querySelector('#story-image');
        const imagePreview = modal.querySelector('.image-preview');
        
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Form submission
        const form = modal.querySelector('.story-upload-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitStory(modal);
        });
    }
    
    submitStory(modal) {
        // Simulate story submission
        const formData = new FormData(modal.querySelector('.story-upload-form'));
        
        // Show loading state
        const submitBtn = modal.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sharing...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Add story to grid
            this.addStoryToGrid({
                image: modal.querySelector('#story-image').files[0],
                location: modal.querySelector('#story-location').value,
                text: modal.querySelector('#story-text').value
            });
            
            // Close modal
            modal.remove();
            
            // Show success notification
            this.showSuccessNotification();
        }, 2000);
    }
    
    addStoryToGrid(storyData) {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card fade-in-up';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            storyCard.innerHTML = `
                <div class="story-image">
                    <img src="${e.target.result}" alt="Travel Story">
                    <div class="story-overlay">
                        <div class="story-author">
                            <img src="https://i.pravatar.cc/40?img=${Math.floor(Math.random() * 10)}" alt="Author" class="author-avatar">
                            <span class="author-name">You</span>
                        </div>
                        <div class="story-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${storyData.location}</span>
                        </div>
                    </div>
                </div>
                <div class="story-content">
                    <p>"${storyData.text}"</p>
                    <div class="story-engagement">
                        <button class="engagement-btn">
                            <i class="fas fa-heart"></i>
                            <span>0</span>
                        </button>
                        <button class="engagement-btn">
                            <i class="fas fa-comment"></i>
                            <span>0</span>
                        </button>
                        <button class="engagement-btn">
                            <i class="fas fa-share"></i>
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            `;
        };
        
        reader.readAsDataURL(storyData.image);
        
        // Insert at beginning of grid
        this.storiesGrid.insertBefore(storyCard, this.storiesGrid.firstChild);
    }
    
    showSuccessNotification() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Story shared successfully!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Badge System
class BadgeSystem {
    constructor() {
        this.badges = [
            { id: 'mountain_climber', name: 'Mountain Climber', icon: '🏔️', progress: 3, target: 5 },
            { id: 'foodie_explorer', name: 'Foodie Explorer', icon: '🍛', progress: 4, target: 10 },
            { id: 'culture_lover', name: 'Culture Lover', icon: '🏛️', progress: 6, target: 8 },
            { id: 'beach_bum', name: 'Beach Bum', icon: '🌊', progress: 1, target: 5 }
        ];
        
        this.init();
    }
    
    init() {
        this.updateBadgeProgress();
        this.setupBadgeAnimations();
    }
    
    updateBadgeProgress() {
        const badgeCards = document.querySelectorAll('.badge-card');
        
        badgeCards.forEach((card, index) => {
            const badge = this.badges[index];
            if (badge) {
                const progressBar = card.querySelector('.progress-fill');
                const progressText = card.querySelector('.progress-text');
                
                if (progressBar && progressText) {
                    const percentage = (badge.progress / badge.target) * 100;
                    progressBar.style.width = `${percentage}%`;
                    progressText.textContent = `${badge.progress}/${badge.target} completed`;
                    
                    // Update card state
                    if (badge.progress >= badge.target) {
                        card.classList.remove('locked');
                        card.classList.add('unlocked');
                    }
                }
            }
        });
    }
    
    setupBadgeAnimations() {
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateBadgeProgress(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.badge-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    animateBadgeProgress(card) {
        const progressBar = card.querySelector('.progress-fill');
        if (progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.transition = 'width 2s ease-out';
                progressBar.style.width = width;
            }, 200);
        }
    }
    
    awardBadge(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (badge) {
            badge.progress++;
            this.updateBadgeProgress();
            
            if (badge.progress === badge.target) {
                this.showBadgeNotification(badge);
            }
        }
    }
    
    showBadgeNotification(badge) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="badge-icon-large">${badge.icon}</div>
                <div class="badge-text">
                    <h3>Badge Unlocked!</h3>
                    <p>${badge.name}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 4000);
    }
}

// Local Buddy Connect
class LocalBuddyConnect {
    constructor() {
        this.buddyCards = document.querySelectorAll('.buddy-card');
        this.init();
    }
    
    init() {
        this.setupBuddyInteractions();
    }
    
    setupBuddyInteractions() {
        this.buddyCards.forEach(card => {
            const connectBtn = card.querySelector('.btn-buddy');
            if (connectBtn) {
                connectBtn.addEventListener('click', () => {
                    this.showBuddyConnectModal(card);
                });
            }
        });
    }
    
    showBuddyConnectModal(buddyCard) {
        const buddyName = buddyCard.querySelector('.buddy-name').textContent;
        const buddyLocation = buddyCard.querySelector('.buddy-location').textContent;
        const buddyPrice = buddyCard.querySelector('.price').textContent;
        
        const modal = document.createElement('div');
        modal.className = 'modal buddy-connect-modal active';
        modal.innerHTML = `
            <div class="modal-content buddy-connect-content">
                <div class="modal-header">
                    <h2 class="modal-title">Connect with ${buddyName}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="buddy-profile">
                        <img src="${buddyCard.querySelector('.buddy-image img').src}" alt="${buddyName}">
                        <div class="buddy-info">
                            <h3>${buddyName}</h3>
                            <p><i class="fas fa-map-marker-alt"></i> ${buddyLocation}</p>
                            <p><i class="fas fa-rupee-sign"></i> ${buddyPrice}/hour</p>
                        </div>
                    </div>
                    <div class="connect-form">
                        <h4>Send a Message</h4>
                        <textarea placeholder="Hi! I'm interested in exploring ${buddyLocation} with you..." rows="4"></textarea>
                        <div class="booking-details">
                            <label>
                                <span>Duration (hours):</span>
                                <select>
                                    <option value="2">2 hours</option>
                                    <option value="4">4 hours</option>
                                    <option value="6">6 hours</option>
                                    <option value="8">8 hours</option>
                                </select>
                            </label>
                            <label>
                                <span>Date:</span>
                                <input type="date" min="${new Date().toISOString().split('T')[0]}">
                            </label>
                        </div>
                        <button class="btn-primary full-width">
                            <i class="fas fa-paper-plane"></i>
                            <span>Send Request</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal functionality
        this.setupBuddyModal(modal, buddyName);
    }
    
    setupBuddyModal(modal, buddyName) {
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // Send request
        const sendBtn = modal.querySelector('button[type="button"]');
        sendBtn.addEventListener('click', () => {
            this.sendBuddyRequest(modal, buddyName);
        });
    }
    
    sendBuddyRequest(modal, buddyName) {
        const sendBtn = modal.querySelector('button');
        const originalText = sendBtn.innerHTML;
        
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
        sendBtn.disabled = true;
        
        setTimeout(() => {
            modal.remove();
            this.showRequestSentNotification(buddyName);
        }, 2000);
    }
    
    showRequestSentNotification(buddyName) {
        const notification = document.createElement('div');
        notification.className = 'request-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Request sent to ${buddyName}! They'll respond within 24 hours.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
}

// Marketplace Integration
class MarketplaceIntegration {
    constructor() {
        this.productCards = document.querySelectorAll('.product-card');
        this.cart = [];
        
        this.init();
    }
    
    init() {
        this.setupProductInteractions();
        this.createCartIcon();
    }
    
    setupProductInteractions() {
        this.productCards.forEach(card => {
            const addToCartBtn = card.querySelector('.btn-product');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    this.addToCart(card);
                });
            }
        });
    }
    
    addToCart(productCard) {
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.price').textContent;
        const productImage = productCard.querySelector('.product-image img').src;
        
        const product = {
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        };
        
        // Check if product already exists
        const existingProduct = this.cart.find(p => p.name === productName);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            this.cart.push(product);
        }
        
        this.updateCartIcon();
        this.showAddToCartAnimation(productCard);
        this.showCartNotification(productName);
    }
    
    createCartIcon() {
        const cartIcon = document.createElement('div');
        cartIcon.className = 'cart-icon';
        cartIcon.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        `;
        
        cartIcon.addEventListener('click', () => {
            this.showCartModal();
        });
        
        document.body.appendChild(cartIcon);
    }
    
    updateCartIcon() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCount.parentElement.classList.add('has-items');
            }
        }
    }
    
    showAddToCartAnimation(productCard) {
        const btn = productCard.querySelector('.btn-product');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Added!</span>';
        btn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 1500);
    }
    
    showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-shopping-cart"></i>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
    
    showCartModal() {
        const modal = document.createElement('div');
        modal.className = 'modal cart-modal active';
        modal.innerHTML = `
            <div class="modal-content cart-modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Shopping Cart</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="cart-items">
                        ${this.cart.length === 0 ? '<p class="empty-cart">Your cart is empty</p>' : this.renderCartItems()}
                    </div>
                    ${this.cart.length > 0 ? `
                        <div class="cart-summary">
                            <div class="total-amount">
                                <span>Total: ₹${this.calculateTotal()}</span>
                            </div>
                            <button class="btn-primary full-width">
                                <i class="fas fa-credit-card"></i>
                                <span>Proceed to Checkout</span>
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Setup modal functionality
        this.setupCartModal(modal);
    }
    
    renderCartItems() {
        return this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.querySelector('.quantity').textContent = Math.max(0, parseInt(this.parentElement.parentElement.parentElement.querySelector('.quantity').textContent) - 1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="this.parentElement.parentElement.parentElement.querySelector('.quantity').textContent = parseInt(this.parentElement.parentElement.parentElement.querySelector('.quantity').textContent) + 1">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    calculateTotal() {
        return this.cart.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return total + (price * item.quantity);
        }, 0).toLocaleString();
    }
    
    setupCartModal(modal) {
        // Close modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ExpenseSplitter();
    new EcoExploreMode();
    new StoryUpload();
    new BadgeSystem();
    new LocalBuddyConnect();
    new MarketplaceIntegration();
});

// Export for use in other modules
window.ExpenseSplitter = ExpenseSplitter;
window.EcoExploreMode = EcoExploreMode;
window.StoryUpload = StoryUpload;
window.BadgeSystem = BadgeSystem;
window.LocalBuddyConnect = LocalBuddyConnect;
window.MarketplaceIntegration = MarketplaceIntegration;
