import Visit from "../models/Visit.js";

// CREATE - Plan a new visit
export const planVisit = async (req, res) => {
  try {
    const { destination, selectedDate, userId } = req.body;
    const newVisit = await Visit.create({ destination, selectedDate, userId });
    res.status(201).json({ 
      success: true, 
      message: "Visit planned successfully",
      data: newVisit 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// READ - Get all visits with filtering
export const getAllVisits = async (req, res) => {
  try {
    const { userId, destination, startDate, endDate } = req.query;
    
    const query = {};
    if (userId) query.userId = userId;
    if (destination) query.destination = new RegExp(destination, 'i');
    if (startDate || endDate) {
      query.selectedDate = {};
      if (startDate) query.selectedDate.$gte = new Date(startDate);
      if (endDate) query.selectedDate.$lte = new Date(endDate);
    }
    
    const visits = await Visit.find(query).sort({ selectedDate: -1 });
    
    res.json({ 
      success: true, 
      count: visits.length,
      data: visits 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// READ - Get single visit by ID
export const getVisitById = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findById(id);
    
    if (!visit) {
      return res.status(404).json({ 
        success: false, 
        error: "Visit not found" 
      });
    }
    
    res.json({ success: true, data: visit });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// UPDATE - Update visit details
export const updateVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const visit = await Visit.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!visit) {
      return res.status(404).json({ 
        success: false, 
        error: "Visit not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Visit updated successfully",
      data: visit 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// DELETE - Cancel/delete visit
export const deleteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await Visit.findByIdAndDelete(id);
    
    if (!visit) {
      return res.status(404).json({ 
        success: false, 
        error: "Visit not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Visit cancelled successfully",
      data: visit
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get user's visit history
export const getUserVisits = async (req, res) => {
  try {
    const { userId } = req.params;
    const visits = await Visit.find({ userId }).sort({ selectedDate: -1 });
    
    res.json({ 
      success: true, 
      count: visits.length,
      data: visits 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get visit statistics
export const getVisitStats = async (req, res) => {
  try {
    const totalVisits = await Visit.countDocuments();
    const upcomingVisits = await Visit.countDocuments({ 
      selectedDate: { $gte: new Date() } 
    });
    const pastVisits = await Visit.countDocuments({ 
      selectedDate: { $lt: new Date() } 
    });
    
    // Most popular destinations
    const popularDestinations = await Visit.aggregate([
      { $group: { _id: "$destination", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({ 
      success: true,
      stats: {
        total: totalVisits,
        upcoming: upcomingVisits,
        past: pastVisits,
        popularDestinations
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};