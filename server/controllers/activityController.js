import Activity from '../models/Activity.js';

export const listActivities = async (req, res, next) => {
  try {
    const { cityId, category, maxCost, maxDuration } = req.query;
    const filter = {};
    if (cityId) filter.cityId = cityId;
    if (category) filter.category = category;
    if (maxCost !== undefined) filter.estimatedCost = { $lte: Number(maxCost) };
    if (maxDuration !== undefined) {
      filter.duration = { ...(filter.duration || {}), $lte: Number(maxDuration) };
    }
    const activities = await Activity.find(filter).populate('cityId').sort({ rating: -1 });
    res.json({ success: true, activities });
  } catch (err) {
    next(err);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const activity = await Activity.findById(req.params.id).populate('cityId');
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    res.json({ success: true, activity });
  } catch (err) {
    next(err);
  }
};
