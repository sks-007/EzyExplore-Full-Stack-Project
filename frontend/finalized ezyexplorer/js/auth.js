// Authentication and Login Functionality

class AuthManager {
    constructor() {
        this.loginModal = document.getElementById('login-modal');
        this.loginBtn = document.getElementById('login-btn');
        this.modalClose = document.getElementById('modal-close');
        this.authTabs = document.querySelectorAll('.auth-tab');
        this.loginForm = document.getElementById('login-form');
        this.signupForm = document.getElementById('signup-form');
        this.API_URL = 'http://localhost:9000/api/auth';
        
        // Bind the click handler so we can remove/add it
        this.handleLoginBtnClick = this.handleLoginBtnClick.bind(this);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.checkExistingAuth();
    }
    
    checkExistingAuth() {
        // Check if user is already logged in
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            const user = JSON.parse(userData);
            this.updateLoginButton(true, user.name, user.email);
        }
    }
    
    handleLoginBtnClick(e) {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (token) {
            this.showLogoutPopup(e);
        } else {
            this.showLoginModal();
        }
    }
    
    setupEventListeners() {
        // Login button click - dynamically handled based on auth state
        this.loginBtn.addEventListener('click', this.handleLoginBtnClick);
        
        // Modal close button
        this.modalClose.addEventListener('click', () => {
            this.hideLoginModal();
        });
        
        // Click outside modal to close
        this.loginModal.addEventListener('click', (e) => {
            if (e.target === this.loginModal) {
                this.hideLoginModal();
            }
        });
        
        // Auth tab switching
        this.authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchAuthTab(tab.dataset.tab);
            });
        });
        
        // Form submissions
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });
        
        this.signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSignup(e);
        });
    }
    
    setupFormValidation() {
        // Real-time validation for email fields
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateEmail(input);
            });
        });
        
        // Real-time validation for password fields
        const passwordInputs = document.querySelectorAll('input[type="password"]');
        passwordInputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validatePassword(input);
            });
        });
    }
    
    showLoginModal() {
        if (this.loginModal) {
            this.loginModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus on first input
            const firstInput = this.loginModal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    hideLoginModal() {
        if (this.loginModal) {
            this.loginModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset forms
            this.resetForms();
        }
    }
    
    switchAuthTab(tabName) {
        // Update tab appearance
        this.authTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            }
        });
        
        // Show/hide forms
        if (tabName === 'login') {
            this.loginForm.style.display = 'block';
            this.signupForm.style.display = 'none';
        } else {
            this.loginForm.style.display = 'none';
            this.signupForm.style.display = 'block';
        }
    }
    
    handleLogin(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('remember') === 'on';
        
        // Validate inputs
        if (!this.validateEmail(document.getElementById('email'))) return;
        if (!this.validatePassword(document.getElementById('password'))) return;
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
        submitBtn.disabled = true;
        
        // Call API
        fetch(`${this.API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, rememberMe })
        })
        .then(response => {
            // Parse JSON regardless of status code
            return response.json().then(data => ({
                ok: response.ok,
                status: response.status,
                data: data
            }));
        })
        .then(result => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (result.ok && result.data.success) {
                // Store token and user data
                localStorage.setItem('authToken', result.data.token);
                localStorage.setItem('userData', JSON.stringify(result.data.user));
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // Hide error message if visible
                document.getElementById('login-error-message').style.display = 'none';
                
                // Show success message
                this.showSuccessMessage('Login successful! Welcome back.');
                
                // Hide modal
                this.hideLoginModal();
                
                // Update login button
                this.updateLoginButton(true, result.data.user.name, result.data.user.email);
            } else {
                this.showInlineError('login', result.data.error || result.data.message || 'Login failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showInlineError('login', 'Connection error. Please try again.');
        });
    }
    
    handleSignup(e) {
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const phone = formData.get('phone') || '';
        
        // Validate inputs
        if (!this.validateName(document.getElementById('signup-name'))) return;
        if (!this.validateEmail(document.getElementById('signup-email'))) return;
        if (!this.validatePassword(document.getElementById('signup-password'))) return;
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        // Call API
        fetch(`${this.API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, phone })
        })
        .then(response => {
            // Parse JSON regardless of status code
            return response.json().then(data => ({
                ok: response.ok,
                status: response.status,
                data: data
            }));
        })
        .then(result => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            if (result.ok && result.data.success) {
                // Store token and user data
                localStorage.setItem('authToken', result.data.token);
                localStorage.setItem('userData', JSON.stringify(result.data.user));
                
                // Hide error message if visible
                document.getElementById('signup-error-message').style.display = 'none';
                
                // Show success message
                this.showSuccessMessage('Account created successfully! Welcome to EzyExplorer.');
                
                // Hide modal
                this.hideLoginModal();
                
                // Update login button
                this.updateLoginButton(true, result.data.user.name, result.data.user.email);
            } else {
                this.showInlineError('signup', result.data.error || result.data.message || 'Signup failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Signup error:', error);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            this.showInlineError('signup', 'Connection error. Please try again.');
        });
    }
    
    validateEmail(input) {
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showFieldError(input, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }
    
    validatePassword(input) {
        const password = input.value;
        
        if (!password) {
            this.showFieldError(input, 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showFieldError(input, 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }
    
    validateName(input) {
        const name = input.value.trim();
        
        if (!name) {
            this.showFieldError(input, 'Name is required');
            return false;
        }
        
        if (name.length < 2) {
            this.showFieldError(input, 'Name must be at least 2 characters');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    }
    
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(input) {
        input.classList.remove('error');
        
        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    resetForms() {
        // Reset all form inputs
        const inputs = this.loginModal.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
            this.clearFieldError(input);
        });
        
        // Reset to login tab
        this.switchAuthTab('login');
    }
    
    showSuccessMessage(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    showInlineError(formType, message) {
        const errorDiv = document.getElementById(`${formType}-error-message`);
        const errorText = document.getElementById(`${formType}-error-text`);
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    showErrorMessage(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    updateLoginButton(isLoggedIn, name = '', email = '') {
        if (isLoggedIn) {
            this.loginBtn.innerHTML = `
                <i class="fas fa-user-check"></i>
                <span>${name || email.split('@')[0]}</span>
            `;
        } else {
            this.loginBtn.innerHTML = `
                <i class="fas fa-user"></i>
                <span>Login</span>
            `;
        }
    }
    
    showLogoutPopup(e) {
        e.stopPropagation();
        
        // Remove existing popup
        const existingPopup = document.querySelector('.logout-popup');
        if (existingPopup) {
            existingPopup.remove();
            return;
        }
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        
        const popup = document.createElement('div');
        popup.className = 'logout-popup';
        popup.innerHTML = `
            <div class="logout-popup-content">
                <div class="logout-popup-header">
                    <div class="user-avatar">
                        <i class="fas fa-user-circle"></i>
                    </div>
                    <div class="user-info">
                        <h3>${userData.name || 'User'}</h3>
                        <p>${userData.email || ''}</p>
                    </div>
                </div>
                <div class="logout-popup-body">
                    <button class="popup-menu-item" onclick="window.authManager.viewProfile()">
                        <i class="fas fa-user"></i>
                        <span>My Profile</span>
                    </button>
                    <button class="popup-menu-item" onclick="window.authManager.viewBookings()">
                        <i class="fas fa-calendar-check"></i>
                        <span>My Bookings</span>
                    </button>
                    <button class="popup-menu-item" onclick="window.authManager.viewWishlist()">
                        <i class="fas fa-heart"></i>
                        <span>My Wishlist</span>
                    </button>
                    <hr class="popup-divider">
                    <button class="popup-menu-item logout-btn" onclick="window.authManager.handleLogout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Position popup below button
        const rect = this.loginBtn.getBoundingClientRect();
        const popupContent = popup.querySelector('.logout-popup-content');
        popupContent.style.top = `${rect.bottom + 10}px`;
        popupContent.style.right = `${window.innerWidth - rect.right}px`;
        
        // Show popup with animation
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Close popup when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closePopup(event) {
                if (!popup.contains(event.target) && event.target !== window.authManager.loginBtn) {
                    popup.classList.remove('show');
                    setTimeout(() => popup.remove(), 300);
                    document.removeEventListener('click', closePopup);
                }
            });
        }, 100);
    }
    
    viewProfile() {
        // Close popup
        const popup = document.querySelector('.logout-popup');
        if (popup) popup.remove();
        
        window.location.hash = 'profile';
        this.showSuccessMessage('Profile section coming soon!');
    }
    
    viewBookings() {
        // Close popup
        const popup = document.querySelector('.logout-popup');
        if (popup) popup.remove();
        
        window.location.hash = 'bookings';
        this.showSuccessMessage('Bookings section coming soon!');
    }
    
    viewWishlist() {
        // Close popup
        const popup = document.querySelector('.logout-popup');
        if (popup) popup.remove();
        
        window.location.hash = 'wishlist';
        this.showSuccessMessage('Wishlist section coming soon!');
    }
    
    handleLogout() {
        // Close popup
        const popup = document.querySelector('.logout-popup');
        if (popup) popup.remove();
        
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('rememberMe');
        
        // Update UI
        this.updateLoginButton(false);
        this.showSuccessMessage('You have been logged out successfully.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});

// Export for use in other modules
window.AuthManager = AuthManager;