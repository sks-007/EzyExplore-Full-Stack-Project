import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  avatar: { type: String, default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" },
  bio: { type: String },
  preferences: {
    favoriteCategories: [String],
    budget: String,
    travelStyle: String
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  stats: {
    placesVisited: { type: Number, default: 0 },
    reviewsWritten: { type: Number, default: 0 },
    buddiesConnected: { type: Number, default: 0 }
  },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ['user', 'buddy', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

export default mongoose.model("User", userSchema);
