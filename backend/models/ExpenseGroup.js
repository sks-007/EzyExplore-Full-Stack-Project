import mongoose from "mongoose";

const expenseItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paidBy: {
    type: String,
    required: true
  },
  splitAmong: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const expenseGroupSchema = new mongoose.Schema({
  groupName: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true
  },
  members: [{
    name: {
      type: String,
      required: true
    },
    email: {
      type: String
    }
  }],
  tripId: {
    type: String
  },
  expenses: [expenseItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['active', 'settled', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Calculate total before saving
expenseGroupSchema.pre('save', function(next) {
  this.totalAmount = this.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  next();
});

export default mongoose.model("ExpenseGroup", expenseGroupSchema);
