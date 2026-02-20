// Comments System with Local Storage - Inline Form Version
class CommentsManager {
  constructor() {
    this.comments = [];
    this.currentRating = 5;
    this.init();
  }

  init() {
    this.loadComments();
    this.setupEventListeners();
    this.renderComments();
  }

  loadComments() {
    const savedComments = localStorage.getItem('ezyexplorer_comments');
    if (savedComments) {
      try {
        this.comments = JSON.parse(savedComments);
      } catch (error) {
        console.error('Error loading comments:', error);
        this.comments = [];
      }
    }
  }

  saveComments() {
    try {
      localStorage.setItem('ezyexplorer_comments', JSON.stringify(this.comments));
    } catch (error) {
      console.error('Error saving comments:', error);
      if (window.showNotificationPopup) {
        window.showNotificationPopup('Error', 'Failed to save comment. Please try again.', 'error');
      }
    }
  }

  setupEventListeners() {
    // Form submit
    const form = document.getElementById('comment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addComment();
      });
    }

    // Star rating
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        this.currentRating = parseInt(star.dataset.rating);
        this.updateStarDisplay();
        document.getElementById('comment-rating').value = this.currentRating;
      });

      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.dataset.rating);
        this.highlightStars(rating);
      });
    });

    const starRating = document.getElementById('star-rating');
    if (starRating) {
      starRating.addEventListener('mouseleave', () => {
        this.updateStarDisplay();
      });
    }

    // Initialize star display
    this.updateStarDisplay();
  }

  highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating .star');
    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  updateStarDisplay() {
    this.highlightStars(this.currentRating);
  }

  resetForm() {
    const form = document.getElementById('comment-form');
    if (form) {
      form.reset();
    }
    this.currentRating = 5;
    this.updateStarDisplay();
  }

  addComment() {
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');

    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    const rating = this.currentRating;

    if (!name || !text) {
      if (window.showNotificationPopup) {
        window.showNotificationPopup('Missing Information', 'Please fill in all fields!', 'error');
      }
      return;
    }

    const comment = {
      id: Date.now(),
      name: name,
      text: text,
      rating: rating,
      date: new Date().toISOString(),
      isUserComment: true
    };

    this.comments.unshift(comment); // Add to beginning of array
    this.saveComments();
    this.renderComments();
    this.resetForm();

    // Show success message
    this.showNotification('Comment added successfully!', 'success');

    // Scroll to comments list
    const commentsList = document.getElementById('comments-list');
    if (commentsList) {
      commentsList.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  deleteComment(id) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.comments = this.comments.filter(comment => comment.id !== id);
      this.saveComments();
      this.renderComments();
      this.showNotification('Comment deleted successfully!', 'success');
    }
  }

  renderComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;

    if (this.comments.length === 0) {
      commentsList.innerHTML = `
        <div class="empty-comments">
          <i class="fas fa-comments"></i>
          <p>No comments yet</p>
          <p style="font-size: 0.9rem; opacity: 0.8;">Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    commentsList.innerHTML = this.comments.map(comment => this.createCommentHTML(comment)).join('');

    // Add event listeners for delete buttons
    const deleteButtons = commentsList.querySelectorAll('.delete-comment-btn');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const commentId = parseInt(e.currentTarget.dataset.commentId);
        this.deleteComment(commentId);
      });
    });
  }

  createCommentHTML(comment) {
    const stars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
    const initials = comment.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const timeAgo = this.getTimeAgo(new Date(comment.date));

    return `
      <div class="comment-card">
        <div class="comment-header">
          <div class="comment-user-info">
            <div class="comment-avatar">${initials}</div>
            <div class="comment-user-details">
              <div class="comment-user-name">${this.escapeHtml(comment.name)}</div>
              <div class="comment-date">${timeAgo}</div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
            <div class="comment-rating">${stars}</div>
            ${comment.isUserComment ? `
              <div class="comment-actions">
                <button class="delete-comment-btn" data-comment-id="${comment.id}">
                  <i class="fas fa-trash"></i>
                  Delete
                </button>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHtml(comment.text)}
        </div>
      </div>
    `;
  }

  getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }

    return 'Just now';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showNotification(message, type = 'success') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    
    const bgColor = type === 'success' ? '#10b981' : '#ef4444';
    
    notification.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize comments manager when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CommentsManager();
  });
} else {
  // DOM already loaded
  new CommentsManager();
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  /* Inline Form Styles */
  .add-comment-form-section {
    margin-bottom: 3rem;
  }

  .comment-form-card {
    background: linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%);
    border: 2px solid #e0e7ff;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .form-card-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .form-card-title i {
    color: #3b82f6;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
    background: white;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .btn-submit-comment {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    padding: 0.875rem 2rem;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .btn-submit-comment:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  .btn-submit-comment:active {
    transform: translateY(0);
  }

  .comments-display-section {
    margin-top: 2rem;
  }

  .comments-display-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .comments-display-title i {
    color: #8b5cf6;
  }

  @media (max-width: 768px) {
    .comment-form-card {
      padding: 1.5rem;
    }

    .form-card-title {
      font-size: 1.25rem;
    }

    .btn-submit-comment {
      width: 100%;
      justify-content: center;
    }
  }
`;
document.head.appendChild(style);

