import Review from "../models/Review.js";
import User from "../models/User.js";

// Get reviews for a destination
export const getDestinationReviews = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const reviews = await Review.find({ destinationId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    
    res.json({ 
      reviews, 
      count: reviews.length,
      averageRating: avgRating.toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a review
export const createReview = async (req, res) => {
  try {
    const { userId, destinationId, destinationName, category, rating, title, comment, images, visitDate } = req.body;
    
    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({ userId, destinationId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this destination" });
    }
    
    const review = new Review({
      userId,
      destinationId,
      destinationName,
      category,
      rating,
      title,
      comment,
      images: images || [],
      visitDate
    });
    
    await review.save();
    
    // Update user stats
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.reviewsWritten': 1 }
    });
    
    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark review as helpful
export const markReviewHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;
    
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Check if user already marked as helpful
    if (review.helpful.includes(userId)) {
      return res.status(400).json({ error: "Already marked as helpful" });
    }
    
    review.helpful.push(userId);
    review.likes += 1;
    await review.save();
    
    res.json({ message: "Marked as helpful", likes: review.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findByIdAndDelete(reviewId);
    
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    
    // Update user stats
    await User.findByIdAndUpdate(review.userId, {
      $inc: { 'stats.reviewsWritten': -1 }
    });
    
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
