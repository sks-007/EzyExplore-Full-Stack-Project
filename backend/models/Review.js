import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinationId: { type: String, required: true },
  destinationName: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  images: [String],
  likes: { type: Number, default: 0 },
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  verified: { type: Boolean, default: false },
  visitDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster queries
reviewSchema.index({ destinationId: 1, rating: -1 });
reviewSchema.index({ userId: 1 });

export default mongoose.model("Review", reviewSchema);
