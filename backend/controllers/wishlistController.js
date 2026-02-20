import Wishlist from "../models/Wishlist.js";

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const { userId } = req.query;
    const wishlist = await Wishlist.find({ userId: userId || "guest" });
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { userId, destinationId, destination } = req.body;
    
    const wishlistItem = new Wishlist({
      userId: userId || "guest",
      destinationId,
      destination
    });
    
    await wishlistItem.save();
    res.status(201).json({ message: "Added to wishlist", item: wishlistItem });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Item already in wishlist" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, destinationId } = req.body;
    
    const result = await Wishlist.findOneAndDelete({
      userId: userId || "guest",
      destinationId
    });
    
    if (!result) {
      return res.status(404).json({ error: "Item not found in wishlist" });
    }
    
    res.json({ message: "Removed from wishlist", item: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    await Wishlist.deleteMany({ userId: userId || "guest" });
    res.json({ message: "Wishlist cleared" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
