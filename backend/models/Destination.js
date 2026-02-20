import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['states', 'mountains', 'beaches', 'heritage'],
    required: true
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  eco: {
    type: Boolean,
    default: false
  },
  location: {
    type: String
  },
  bestTimeToVisit: {
    type: String
  },
  activities: [{
    type: String
  }],
  averageCost: {
    type: Number
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  popularityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better search performance
destinationSchema.index({ category: 1 });
destinationSchema.index({ title: 'text', description: 'text' });
destinationSchema.index({ rating: -1, popularityScore: -1 });

export default mongoose.model("Destination", destinationSchema);
