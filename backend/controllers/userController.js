import User from "../models/User.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    
    const user = new User({ name, email, password, phone });
    await user.save();
    
    res.status(201).json({ 
      message: "User created successfully", 
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    
    // Don't allow password updates through this endpoint
    delete updates.password;
    
    const user = await User.findByIdAndUpdate(
      userId, 
      { ...updates, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user stats
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('stats badges');
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ stats: user.stats, badges: user.badges });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Award badge to user
export const awardBadge = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, icon } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if badge already exists
    const existingBadge = user.badges.find(b => b.name === name);
    if (existingBadge) {
      return res.status(400).json({ error: "Badge already awarded" });
    }
    
    user.badges.push({ name, icon, earnedAt: new Date() });
    await user.save();
    
    res.json({ message: "Badge awarded successfully", badge: user.badges[user.badges.length - 1] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
