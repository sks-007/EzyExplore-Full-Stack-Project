import Destination from "../models/Destination.js";

// Get all destinations with filtering and search
export const getDestinations = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minRating, 
      eco, 
      sort = '-rating',
      limit = 50,
      page = 1 
    } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Filter by eco-friendly
    if (eco === 'true') {
      query.eco = true;
    }

    // Filter by minimum rating
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const destinations = await Destination
      .find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single destination by ID
export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findById(id);
    
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json(destination);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new destination (admin)
export const createDestination = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json({ message: "Destination created", destination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update destination (admin)
export const updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Destination updated", destination });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get popular destinations
export const getPopularDestinations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const destinations = await Destination
      .find()
      .sort({ popularityScore: -1, rating: -1 })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Increment popularity score
export const incrementPopularity = async (req, res) => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByIdAndUpdate(
      id,
      { $inc: { popularityScore: 1 } },
      { new: true }
    );

    if (!destination) {
      return res.status(404).json({ error: "Destination not found" });
    }

    res.json({ message: "Popularity updated", popularityScore: destination.popularityScore });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
