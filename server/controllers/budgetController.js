import Budget from '../models/Budget.js';
import Trip from '../models/Trip.js';

export const getBudget = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    let budget = await Budget.findOne({ tripId: trip._id });
    if (!budget) {
      budget = await Budget.create({ tripId: trip._id });
    }
    const doc = budget.toObject({ virtuals: true });
    res.json({ success: true, budget: doc });
  } catch (err) {
    next(err);
  }
};

export const upsertBudget = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const fields = [
      'transport',
      'accommodation',
      'activities',
      'meals',
      'miscellaneous',
      'dailyLimit',
      'costPerPersonMultiplier',
    ];
    let budget = await Budget.findOne({ tripId: trip._id });
    if (!budget) {
      budget = await Budget.create({ tripId: trip._id });
    }
    for (const k of fields) {
      if (req.body[k] !== undefined) budget[k] = Number(req.body[k]);
    }
    await budget.save();
    trip.totalBudget = budget.transport + budget.accommodation + budget.activities + budget.meals + budget.miscellaneous;
    await trip.save();
    const doc = budget.toObject({ virtuals: true });
    res.json({ success: true, budget: doc });
  } catch (err) {
    next(err);
  }
};

export const createBudget = upsertBudget;

export const updateBudget = upsertBudget;
