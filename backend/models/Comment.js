import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest'
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  destinationId: {
    type: String
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  likes: {
    type: Number,
    default: 0
  },
  helpful: [{
    type: String
  }],
  isUserComment: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'flagged'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
commentSchema.index({ destinationId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ status: 1 });

export default mongoose.model("Comment", commentSchema);
