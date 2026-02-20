// Local Buddies Feature
(function() {
  'use strict';

  // Local buddies data
  const localBuddies = [
    {
      name: 'Rajesh Kumar',
      experience: '8 Years',
      tripsCompleted: 250,
      perHourCharge: 500,
      specialty: 'Heritage',
      specialtyIcon: 'monument',
      avatar: 'RK',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop'
    },
    {
      name: 'Priya Sharma',
      experience: '5 Years',
      tripsCompleted: 180,
      perHourCharge: 400,
      specialty: 'Mountain',
      specialtyIcon: 'mountain',
      avatar: 'PS',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
    },
    {
      name: 'Amit Patel',
      experience: '10 Years',
      tripsCompleted: 320,
      perHourCharge: 600,
      specialty: 'Heritage',
      specialtyIcon: 'monument',
      avatar: 'AP',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
    },
    {
      name: 'Neha Singh',
      experience: '6 Years',
      tripsCompleted: 210,
      perHourCharge: 450,
      specialty: 'Beach',
      specialtyIcon: 'umbrella-beach',
      avatar: 'NS',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
    },
    {
      name: 'Vikram Reddy',
      experience: '7 Years',
      tripsCompleted: 275,
      perHourCharge: 550,
      specialty: 'Mountain',
      specialtyIcon: 'mountain',
      avatar: 'VR',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
    },
    {
      name: 'Anjali Desai',
      experience: '4 Years',
      tripsCompleted: 150,
      perHourCharge: 350,
      specialty: 'Heritage',
      specialtyIcon: 'monument',
      avatar: 'AD',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop'
    }
  ];

  // Create buddy card HTML
  function createBuddyCard(buddy) {
    return `
      <div class="buddy-card">
        <div class="buddy-header">
          <div class="buddy-avatar">
            <img src="${buddy.image}" alt="${buddy.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <span class="buddy-avatar-fallback">${buddy.avatar}</span>
          </div>
          <div class="buddy-info">
            <h3 class="buddy-name">${buddy.name}</h3>
            <span class="buddy-specialty">
              <i class="fas fa-${buddy.specialtyIcon}"></i>
              ${buddy.specialty}
            </span>
          </div>
        </div>
        
        <div class="buddy-stats">
          <div class="buddy-stat">
            <span class="stat-label">Experience</span>
            <span class="stat-value">
              <i class="fas fa-award"></i>
              ${buddy.experience}
            </span>
          </div>
          <div class="buddy-stat">
            <span class="stat-label">Trips Completed</span>
            <span class="stat-value">
              <i class="fas fa-check-circle"></i>
              ${buddy.tripsCompleted}+
            </span>
          </div>
        </div>
        
        <div class="buddy-price">
          <span class="price-label">Per Hour</span>
          <span class="price-value">
            ₹${buddy.perHourCharge}
            <span class="price-unit">/hr</span>
          </span>
        </div>
        
        <div class="buddy-action">
          <button class="btn-book-buddy" data-buddy="${buddy.name}">
            <i class="fas fa-calendar-check"></i>
            Book Now
          </button>
        </div>
      </div>
    `;
  }

  // Load buddies into the modal
  function loadBuddies() {
    const grid = document.getElementById('local-buddies-grid');
    if (!grid) return;

    grid.innerHTML = localBuddies.map(buddy => createBuddyCard(buddy)).join('');

    // Add event listeners to book buttons
    const bookButtons = grid.querySelectorAll('.btn-book-buddy');
    bookButtons.forEach(button => {
      button.addEventListener('click', function() {
        const buddyName = this.getAttribute('data-buddy');
        handleBooking(buddyName);
      });
    });
  }

  // Expose globally for external access
  window.loadLocalBuddies = loadBuddies;

  // Handle booking
  async function handleBooking(buddyName) {
    const button = event.target.closest('.btn-book-buddy');
    const originalText = button.innerHTML;
    
    try {
      // Find buddy data
      const buddy = localBuddies.find(b => b.name === buddyName);
      
      // Disable button and show loading
      button.disabled = true;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
      
      // Check if bookLocalBuddy function exists (from api.js)
      if (typeof bookLocalBuddy === 'function') {
        // Call API to create booking and notification
        const result = await bookLocalBuddy({
          buddyName: buddyName,
          specialty: buddy ? buddy.specialty : 'Tour Guide',
          perHourCharge: buddy ? buddy.perHourCharge : 500
        });
        
        console.log('Booking created:', result);
        
        // Show success message
        showNotificationPopup(
          'Booking Request Sent!',
          `Your booking request for <strong>${buddyName}</strong> has been sent successfully.<br><br>You will be contacted shortly to confirm your trip details.`,
          'info'
        );
      } else {
        // Fallback if API is not available
        console.warn('API not available, showing notification only');
        showNotificationPopup(
          'Booking Request Sent!',
          `Your booking request for <strong>${buddyName}</strong> has been sent successfully.<br><br>You will be contacted shortly to confirm your trip details.`,
          'info'
        );
      }
    } catch (error) {
      console.error('Error booking buddy:', error);
      showNotificationPopup(
        'Booking Failed',
        'There was an error processing your booking. Please try again.',
        'error'
      );
    } finally {
      // Re-enable button
      button.disabled = false;
      button.innerHTML = originalText;
    }
  }

  // Function to open modal (exposed globally)
  function openModal() {
    const modal = document.getElementById('local-buddies-modal');
    if (modal) {
      loadBuddies();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // Expose globally for external access
  window.openLocalBuddiesModal = openModal;

  // Initialize Local Buddies Modal
  function initLocalBuddiesModal() {
    const modal = document.getElementById('local-buddies-modal');
    const btn = document.getElementById('local-buddies-btn');
    const closeBtn = document.getElementById('local-buddies-modal-close');

    console.log('Local Buddies Init:', { modal, btn, closeBtn });

    if (!modal || !btn || !closeBtn) {
      console.error('Local Buddies elements not found!');
      return;
    }

    console.log('Adding click listener to Local Buddies button');

    // Open modal - use capture phase to intercept before other handlers
    btn.addEventListener('click', function(e) {
      console.log('Local Buddies button clicked! Event:', e);
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Local Buddies button clicked!');
      
      // Don't toggle filter tabs active state
      // Remove active from all filter tabs with data-category
      const filterTabs = document.querySelectorAll('.filter-tab[data-category]');
      filterTabs.forEach(tab => tab.classList.remove('active'));
      
      // Add active to Local Buddies button
      btn.classList.add('active');
      
      loadBuddies();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      console.log('Modal should be visible now', modal.classList);
      
      return false;
    }, true); // Use capture phase

    // Close modal
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      
      // Remove active from Local Buddies button when closing
      btn.classList.remove('active');
      
      // Restore active to the first filter tab (States)
      const firstTab = document.querySelector('.filter-tab[data-category="states"]');
      if (firstTab) firstTab.classList.add('active');
    });

    // Close on outside click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove active from Local Buddies button when closing
        btn.classList.remove('active');
        
        // Restore active to the first filter tab (States)
        const firstTab = document.querySelector('.filter-tab[data-category="states"]');
        if (firstTab) firstTab.classList.add('active');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove active from Local Buddies button when closing
        btn.classList.remove('active');
        
        // Restore active to the first filter tab (States)
        const firstTab = document.querySelector('.filter-tab[data-category="states"]');
        if (firstTab) firstTab.classList.add('active');
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalBuddiesModal);
  } else {
    // DOM already loaded
    initLocalBuddiesModal();
  }

  // Also try after a short delay to ensure all other scripts have run
  setTimeout(initLocalBuddiesModal, 500);

})();
