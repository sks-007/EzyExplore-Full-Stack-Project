// Helpful Button Interaction

class HelpfulManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupHelpfulButtons();
    }
    
    setupHelpfulButtons() {
        const helpfulButtons = document.querySelectorAll('.helpful-btn');
        
        helpfulButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleHelpful(button);
            });
        });
    }
    
    toggleHelpful(button) {
        const isActive = button.classList.contains('active');
        const countSpan = button.querySelector('span');
        const countText = countSpan.textContent;
        const currentCount = parseInt(countText.match(/\d+/)[0]);
        
        if (isActive) {
            // Deactivate - decrease count
            button.classList.remove('active');
            const newCount = currentCount - 1;
            countSpan.textContent = `Helpful (${newCount})`;
            
            // Add animation
            button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        } else {
            // Activate - increase count
            button.classList.add('active');
            const newCount = currentCount + 1;
            countSpan.textContent = `Helpful (${newCount})`;
            
            // Add animation
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HelpfulManager();
});
