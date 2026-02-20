import Booking from "../models/Booking.js";
import User from "../models/User.js";

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate('buddyId', 'name rating')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a booking
export const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const booking = new Booking(bookingData);
    await booking.save();
    
    // Update user stats if destination visit
    if (bookingData.bookingType === 'tour') {
      await User.findByIdAndUpdate(bookingData.userId, {
        $inc: { 'stats.placesVisited': 1 }
      });
    }
    
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status, paymentStatus, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'cancelled', updatedAt: Date.now() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const revenueStats = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    
    res.json({
      total: totalBookings,
      confirmed: confirmedBookings,
      pending: pendingBookings,
      cancelled: cancelledBookings,
      totalRevenue: revenueStats[0]?.totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
