import Comment from "../models/Comment.js";

// Get all comments (with optional filtering)
export const getComments = async (req, res) => {
  try {
    const { destinationId, userId, limit = 50, page = 1, status = 'active' } = req.query;
    
    let query = { status };

    if (destinationId) {
      query.destinationId = destinationId;
    }

    if (userId) {
      query.userId = userId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const comments = await Comment
      .find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Comment.countDocuments(query);

    // Calculate average rating if filtering by destination
    let averageRating = null;
    if (destinationId) {
      const ratingAgg = await Comment.aggregate([
        { $match: { destinationId, status: 'active' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ]);
      averageRating = ratingAgg[0]?.avgRating || 0;
    }

    res.json({
      comments,
      total,
      averageRating,
      pagination: {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { userId, userName, destinationId, text, rating } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const comment = new Comment({
      userId: userId || 'guest',
      userName,
      destinationId,
      text,
      rating
    });

    await comment.save();
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Only allow user to delete their own comments
    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(id);
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark comment as helpful
export const markCommentHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user already marked as helpful
    if (comment.helpful.includes(userId)) {
      return res.status(400).json({ error: "Already marked as helpful" });
    }

    comment.helpful.push(userId);
    comment.likes += 1;
    await comment.save();

    res.json({ message: "Marked as helpful", likes: comment.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update comment status (admin/moderation)
export const updateCommentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'hidden', 'flagged'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const comment = await Comment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.json({ message: "Comment status updated", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comment statistics
export const getCommentStats = async (req, res) => {
  try {
    const stats = await Comment.aggregate([
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    res.json(stats[0] || { totalComments: 0, averageRating: 0, totalLikes: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
