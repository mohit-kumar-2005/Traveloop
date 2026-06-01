import ChecklistItem from '../models/ChecklistItem.js';
import Trip from '../models/Trip.js';

export const getChecklist = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const items = await ChecklistItem.find({ tripId: trip._id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
};

export const addChecklistItem = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const { label, category } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, message: 'Label required' });
    }
    const item = await ChecklistItem.create({
      tripId: trip._id,
      userId: req.user._id,
      label,
      category: category || 'other',
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const updateChecklistItem = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const item = await ChecklistItem.findOne({
      _id: req.params.itemId,
      tripId: trip._id,
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    const { label, category, isPacked } = req.body;
    if (label !== undefined) item.label = label;
    if (category !== undefined) item.category = category;
    if (isPacked !== undefined) item.isPacked = Boolean(isPacked);
    await item.save();
    res.json({ success: true, item });
  } catch (err) {
    next(err);
  }
};

export const deleteChecklistItem = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    await ChecklistItem.deleteOne({ _id: req.params.itemId, tripId: trip._id });
    res.json({ success: true, message: 'Item removed' });
  } catch (err) {
    next(err);
  }
};
