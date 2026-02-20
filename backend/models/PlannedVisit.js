import mongoose from "mongoose";

const plannedVisitSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'guest'
  },
  destinationId: {
    type: String,
    required: true
  },
  destinationName: {
    type: String,
    required: true
  },
  visitDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  companions: [{
    type: String
  }],
  budget: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['planned', 'confirmed', 'completed', 'cancelled'],
    default: 'planned'
  },
  reminders: [{
    date: Date,
    sent: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Compound index for user and destination lookup
plannedVisitSchema.index({ userId: 1, destinationId: 1 });
plannedVisitSchema.index({ visitDate: 1 });
plannedVisitSchema.index({ status: 1 });

export default mongoose.model("PlannedVisit", plannedVisitSchema);
