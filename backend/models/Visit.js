import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  userId: { type: String },
  destination: { type: String, required: true },
  selectedDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Visit", visitSchema);