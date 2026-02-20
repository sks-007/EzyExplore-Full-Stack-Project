import Buddy from "../models/Buddy.js";

// CREATE - Add new buddy
export const createBuddy = async (req, res) => {
  try {
    const buddyData = req.body;
    const buddy = new Buddy(buddyData);
    await buddy.save();
    res.status(201).json({ 
      success: true, 
      message: "Buddy created successfully", 
      data: buddy 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// READ - Get all buddies with filtering and pagination
export const getLocalBuddies = async (req, res) => {
  try {
    const { location, specialty, minRating, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = {};
    if (location) query.location = new RegExp(location, 'i');
    if (specialty) query.specialties = specialty;
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    
    // Execute query with pagination
    const buddies = await Buddy.find(query)
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Buddy.countDocuments(query);
    
    res.json({
      success: true,
      data: buddies,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// READ - Get single buddy by ID
export const getBuddyById = async (req, res) => {
  try {
    const { id } = req.params;
    const buddy = await Buddy.findById(id);
    
    if (!buddy) {
      return res.status(404).json({ 
        success: false, 
        error: "Buddy not found" 
      });
    }
    
    res.json({ success: true, data: buddy });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// UPDATE - Update buddy information
export const updateBuddy = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const buddy = await Buddy.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!buddy) {
      return res.status(404).json({ 
        success: false, 
        error: "Buddy not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Buddy updated successfully", 
      data: buddy 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// DELETE - Remove buddy
export const deleteBuddy = async (req, res) => {
  try {
    const { id } = req.params;
    const buddy = await Buddy.findByIdAndDelete(id);
    
    if (!buddy) {
      return res.status(404).json({ 
        success: false, 
        error: "Buddy not found" 
      });
    }
    
    res.json({ 
      success: true, 
      message: "Buddy deleted successfully",
      data: buddy
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Additional operations
export const toggleBuddyAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const buddy = await Buddy.findById(id);
    
    if (!buddy) {
      return res.status(404).json({ 
        success: false, 
        error: "Buddy not found" 
      });
    }
    
    buddy.availability = !buddy.availability;
    buddy.updatedAt = Date.now();
    await buddy.save();
    
    res.json({ 
      success: true, 
      message: `Buddy is now ${buddy.availability ? 'available' : 'unavailable'}`,
      data: buddy 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateBuddyRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    const buddy = await Buddy.findById(id);
    if (!buddy) {
      return res.status(404).json({ 
        success: false, 
        error: "Buddy not found" 
      });
    }
    
    // Calculate new average rating
    const totalRating = buddy.rating * buddy.totalReviews;
    buddy.totalReviews += 1;
    buddy.rating = (totalRating + rating) / buddy.totalReviews;
    buddy.updatedAt = Date.now();
    
    await buddy.save();
    
    res.json({ 
      success: true, 
      message: "Rating updated successfully",
      data: buddy 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};