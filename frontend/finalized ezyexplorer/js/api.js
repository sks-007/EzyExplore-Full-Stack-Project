// API Configuration and Helper Functions
// Place this in: frontend/finalized ezyexplorer/js/api.js

// API Configuration
const API_BASE_URL = 'http://localhost:9000/api';

// Helper function to get userId (from localStorage or generate guest ID)
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = 'guest_' + Date.now();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// ==========================
// DESTINATIONS API
// ==========================

// Fetch destinations with filters
async function fetchDestinations(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/destinations?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    throw error;
  }
}

// Search destinations
async function searchDestinations(searchTerm, category = 'all') {
  return fetchDestinations({ 
    search: searchTerm, 
    category: category !== 'all' ? category : undefined 
  });
}

// Get popular destinations
async function getPopularDestinations(limit = 10) {
  try {
    const response = await fetch(`${API_BASE_URL}/destinations/popular?limit=${limit}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching popular destinations:', error);
    throw error;
  }
}

// Track destination view
async function trackDestinationView(destinationId) {
  try {
    await fetch(`${API_BASE_URL}/destinations/${destinationId}/increment-popularity`, {
      method: 'POST'
    });
  } catch (error) {
    console.error('Error tracking destination view:', error);
  }
}

// ==========================
// COMMENTS API
// ==========================

// Fetch comments for a destination
async function fetchComments(destinationId = null) {
  try {
    const url = destinationId 
      ? `${API_BASE_URL}/comments?destinationId=${destinationId}`
      : `${API_BASE_URL}/comments`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

// Create a comment
async function createComment(commentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getUserId(),
        userName: commentData.name,
        destinationId: commentData.destinationId || null,
        text: commentData.text,
        rating: commentData.rating
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Delete a comment
async function deleteComment(commentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() })
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// Mark comment as helpful
async function markCommentHelpful(commentId) {
  try {
    const response = await fetch(`${API_BASE_URL}/comments/${commentId}/helpful`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: getUserId() })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error marking comment as helpful:', error);
    throw error;
  }
}

// ==========================
// PLANNED VISITS API
// ==========================

// Get all planned visits
async function getPlannedVisits(upcoming = false) {
  try {
    const params = new URLSearchParams({ 
      userId: getUserId(),
      upcoming: upcoming 
    });
    const response = await fetch(`${API_BASE_URL}/planned-visits?${params}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching planned visits:', error);
    throw error;
  }
}

// Check if destination is planned
async function checkPlannedVisit(destinationId) {
  try {
    const params = new URLSearchParams({ 
      userId: getUserId(),
      destinationId 
    });
    const response = await fetch(`${API_BASE_URL}/planned-visits/check?${params}`);
    return await response.json();
  } catch (error) {
    console.error('Error checking planned visit:', error);
    throw error;
  }
}

// Create planned visit
async function createPlannedVisit(visitData) {
  try {
    const response = await fetch(`${API_BASE_URL}/planned-visits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getUserId(),
        destinationId: visitData.destinationId,
        destinationName: visitData.destinationName,
        visitDate: visitData.visitDate,
        notes: visitData.notes || '',
        companions: visitData.companions || [],
        budget: visitData.budget || 0
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create planned visit');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating planned visit:', error);
    throw error;
  }
}

// Delete planned visit
async function deletePlannedVisit(visitId) {
  try {
    const response = await fetch(`${API_BASE_URL}/planned-visits/${visitId}`, {
      method: 'DELETE'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting planned visit:', error);
    throw error;
  }
}

// Get upcoming visits summary
async function getUpcomingSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/planned-visits/summary?userId=${getUserId()}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming summary:', error);
    throw error;
  }
}

// ==========================
// EXPENSE SPLITTER API
// ==========================

// Get expense groups
async function getExpenseGroups() {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses?userId=${getUserId()}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching expense groups:', error);
    throw error;
  }
}

// Create expense group
async function createExpenseGroup(groupData) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupName: groupData.groupName,
        createdBy: getUserId(),
        members: groupData.members || [],
        tripId: groupData.tripId || null
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error creating expense group:', error);
    throw error;
  }
}

// Add expense to group
async function addExpense(groupId, expenseData) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}

// Remove expense
async function removeExpense(groupId, expenseId) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}/expenses/${expenseId}`, {
      method: 'DELETE'
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error removing expense:', error);
    throw error;
  }
}

// Calculate split
async function calculateSplit(groupId) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}/calculate`);
    return await response.json();
  } catch (error) {
    console.error('Error calculating split:', error);
    throw error;
  }
}

// Add member to group
async function addMemberToGroup(groupId, memberData) {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${groupId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memberData)
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
}

// ==========================
// BOOKINGS API
// ==========================

// Create a booking
async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getUserId(),
        ...bookingData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Get user bookings
async function getUserBookings() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings?userId=${getUserId()}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

// ==========================
// NOTIFICATIONS API
// ==========================

// Create a notification
async function createNotification(notificationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: getUserId(),
        ...notificationData
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

// Get user notifications
async function getUserNotifications(unreadOnly = false) {
  try {
    const url = `${API_BASE_URL}/notifications/${getUserId()}${unreadOnly ? '?unreadOnly=true' : ''}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
    return await response.json();
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
}

// ==========================
// LOCAL BUDDIES API
// ==========================

// Book a local buddy
async function bookLocalBuddy(buddyData) {
  try {
    // Create booking
    const booking = await createBooking({
      type: 'buddy',
      buddyName: buddyData.buddyName,
      buddySpecialty: buddyData.specialty,
      date: buddyData.date || new Date().toISOString(),
      duration: buddyData.duration || '4 hours',
      status: 'pending'
    });
    
    // Create notification
    await createNotification({
      type: 'buddy',
      title: 'Booking Request Sent!',
      message: `Your booking request for ${buddyData.buddyName} has been sent successfully. You will be contacted shortly to confirm your trip details.`,
      link: `/bookings/${booking.booking._id}`
    });
    
    return { booking, success: true };
  } catch (error) {
    console.error('Error booking buddy:', error);
    throw error;
  }
}

// ==========================
// EXAMPLE USAGE
// ==========================

// Example 1: Load destinations with filtering
async function loadDestinationsExample() {
  const data = await fetchDestinations({ category: 'beaches', eco: true, minRating: 4.5 });
  console.log('Filtered destinations:', data.destinations);
}

// Example 2: Create a comment
async function createCommentExample() {
  const comment = await createComment({
    name: 'John Doe',
    text: 'Amazing place to visit!',
    rating: 5,
    destinationId: 'kerala'
  });
  console.log('Comment created:', comment);
}

// Example 3: Plan a visit
async function planVisitExample() {
  const visit = await createPlannedVisit({
    destinationId: 'goa',
    destinationName: 'Goa',
    visitDate: '2025-12-25',
    notes: 'Beach vacation with family',
    budget: 50000
  });
  console.log('Visit planned:', visit);
}

// Example 4: Create expense group and add expenses
async function expenseTrackingExample() {
  // Create group
  const group = await createExpenseGroup({
    groupName: 'Goa Trip 2025',
    members: [
      { name: 'Rahul', email: 'rahul@example.com' },
      { name: 'Priya', email: 'priya@example.com' }
    ]
  });
  
  // Add expense
  await addExpense(group.group._id, {
    description: 'Hotel booking',
    amount: 5000,
    paidBy: 'Rahul',
    splitAmong: ['Rahul', 'Priya']
  });
  
  // Calculate split
  const split = await calculateSplit(group.group._id);
  console.log('Split calculation:', split);
}

// Export all functions
export {
  // Destinations
  fetchDestinations,
  searchDestinations,
  getPopularDestinations,
  trackDestinationView,
  
  // Comments
  fetchComments,
  createComment,
  deleteComment,
  markCommentHelpful,
  
  // Planned Visits
  getPlannedVisits,
  checkPlannedVisit,
  createPlannedVisit,
  deletePlannedVisit,
  getUpcomingSummary,
  
  // Expenses
  getExpenseGroups,
  createExpenseGroup,
  addExpense,
  removeExpense,
  calculateSplit,
  addMemberToGroup,
  
  // Bookings
  createBooking,
  getUserBookings,
  
  // Notifications
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  
  // Local Buddies
  bookLocalBuddy,
  
  // Helpers
  getUserId
};

// Also expose functions globally for non-module usage
if (typeof window !== 'undefined') {
  window.bookLocalBuddy = bookLocalBuddy;
  window.createBooking = createBooking;
  window.createNotification = createNotification;
  window.getUserNotifications = getUserNotifications;
  window.getUserId = getUserId;
}
