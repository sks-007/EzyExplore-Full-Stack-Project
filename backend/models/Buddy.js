import mongoose from "mongoose";

const buddySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  specialties: [{ type: String }],
  languages: [{ type: String }],
  hourlyRate: { type: Number, required: true },
  availability: { type: Boolean, default: true },
  totalReviews: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
  joinedDate: { type: Date, default: Date.now },
  profileImage: { type: String },
  experience: { type: Number, default: 0 }, // years of experience
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

buddySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Buddy", buddySchema);