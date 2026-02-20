import PlannedVisit from "../models/PlannedVisit.js";

// Get all planned visits for a user
export const getPlannedVisits = async (req, res) => {
  try {
    const { userId, status, upcoming } = req.query;

    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    // Filter upcoming visits
    if (upcoming === 'true') {
      query.visitDate = { $gte: new Date() };
    }

    const visits = await PlannedVisit.find(query).sort({ visitDate: 1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single planned visit
export const getPlannedVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await PlannedVisit.findById(id);

    if (!visit) {
      return res.status(404).json({ error: "Planned visit not found" });
    }

    res.json(visit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new planned visit
export const createPlannedVisit = async (req, res) => {
  try {
    const { userId, destinationId, destinationName, visitDate, notes, companions, budget } = req.body;

    // Check if visit already planned
    const existing = await PlannedVisit.findOne({
      userId: userId || 'guest',
      destinationId,
      status: { $in: ['planned', 'confirmed'] }
    });

    if (existing) {
      return res.status(400).json({ 
        error: "Visit already planned for this destination",
        existingVisit: existing 
      });
    }

    const visit = new PlannedVisit({
      userId: userId || 'guest',
      destinationId,
      destinationName,
      visitDate,
      notes,
      companions: companions || [],
      budget
    });

    await visit.save();
    res.status(201).json({ message: "Visit planned successfully", visit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update planned visit
export const updatePlannedVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const visit = await PlannedVisit.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!visit) {
      return res.status(404).json({ error: "Planned visit not found" });
    }

    res.json({ message: "Visit updated", visit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete planned visit
export const deletePlannedVisit = async (req, res) => {
  try {
    const { id } = req.params;

    const visit = await PlannedVisit.findByIdAndDelete(id);

    if (!visit) {
      return res.status(404).json({ error: "Planned visit not found" });
    }

    res.json({ message: "Visit deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update visit status
export const updateVisitStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['planned', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const visit = await PlannedVisit.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!visit) {
      return res.status(404).json({ error: "Planned visit not found" });
    }

    res.json({ message: "Status updated", visit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check if destination is already planned
export const checkPlannedVisit = async (req, res) => {
  try {
    const { userId, destinationId } = req.query;

    const visit = await PlannedVisit.findOne({
      userId: userId || 'guest',
      destinationId,
      status: { $in: ['planned', 'confirmed'] }
    });

    res.json({ 
      isPlanned: !!visit,
      visit: visit || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get upcoming visits summary
export const getUpcomingSummary = async (req, res) => {
  try {
    const { userId } = req.query;

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const summary = await PlannedVisit.aggregate([
      {
        $match: {
          userId: userId || 'guest',
          status: { $in: ['planned', 'confirmed'] }
        }
      },
      {
        $facet: {
          thisWeek: [
            { $match: { visitDate: { $gte: now, $lte: nextWeek } } },
            { $count: "count" }
          ],
          thisMonth: [
            { $match: { visitDate: { $gte: now, $lte: nextMonth } } },
            { $count: "count" }
          ],
          total: [
            { $match: { visitDate: { $gte: now } } },
            { $count: "count" }
          ]
        }
      }
    ]);

    res.json({
      thisWeek: summary[0]?.thisWeek[0]?.count || 0,
      thisMonth: summary[0]?.thisMonth[0]?.count || 0,
      total: summary[0]?.total[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
