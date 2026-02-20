import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  buddyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Buddy' },
  destination: { type: String, required: true },
  category: { type: String, required: true },
  bookingType: { type: String, enum: ['tour', 'buddy', 'accommodation', 'transport'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  numberOfPeople: { type: Number, default: 1 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  specialRequests: { type: String },
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Booking", bookingSchema);
