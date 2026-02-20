import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  destinationId: { type: String, required: true },
  destination: {
    id: String,
    name: String,
    image: String,
    location: String,
    rating: Number
  },
  createdAt: { type: Date, default: Date.now }
});

// Index to ensure unique wishlist items per user
wishlistSchema.index({ userId: 1, destinationId: 1 }, { unique: true });

export default mongoose.model("Wishlist", wishlistSchema);
