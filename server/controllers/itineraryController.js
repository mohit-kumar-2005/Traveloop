import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';
import City from '../models/City.js';
import Activity from '../models/Activity.js';

export const addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const { cityId, arrivalDate, departureDate, notes, stopBudget } = req.body;
    if (!cityId || !arrivalDate || !departureDate) {
      return res.status(400).json({ success: false, message: 'City and dates required' });
    }
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    const order = trip.stops.length;
    const stop = await Stop.create({
      tripId: trip._id,
      cityId: city._id,
      cityName: city.name,
      country: city.country,
      arrivalDate,
      departureDate,
      notes: notes || '',
      stopBudget: Number(stopBudget) || 0,
      order,
    });
    trip.stops.push(stop._id);
    await trip.save();
    const populated = await Stop.findById(stop._id).populate('cityId').populate('activities');
    res.status(201).json({ success: true, stop: populated });
  } catch (err) {
    next(err);
  }
};

export const updateStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const stop = await Stop.findOne({ _id: req.params.stopId, tripId: trip._id });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    const { cityId, arrivalDate, departureDate, notes, stopBudget } = req.body;
    if (cityId) {
      const city = await City.findById(cityId);
      if (city) {
        stop.cityId = city._id;
        stop.cityName = city.name;
        stop.country = city.country;
      }
    }
    if (arrivalDate) stop.arrivalDate = arrivalDate;
    if (departureDate) stop.departureDate = departureDate;
    if (notes !== undefined) stop.notes = notes;
    if (stopBudget !== undefined) stop.stopBudget = Number(stopBudget);
    await stop.save();
    const populated = await Stop.findById(stop._id).populate('cityId').populate('activities');
    res.json({ success: true, stop: populated });
  } catch (err) {
    next(err);
  }
};

export const deleteStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const stop = await Stop.findOneAndDelete({ _id: req.params.stopId, tripId: trip._id });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    trip.stops = trip.stops.filter((id) => id.toString() !== stop._id.toString());
    await trip.save();
    const remaining = await Stop.find({ tripId: trip._id }).sort({ order: 1 });
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].order = i;
      await remaining[i].save();
    }
    res.json({ success: true, message: 'Stop removed' });
  } catch (err) {
    next(err);
  }
};

export const reorderStops = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ success: false, message: 'order must be an array of stop ids' });
    }
    for (let i = 0; i < order.length; i++) {
      await Stop.updateOne(
        { _id: order[i], tripId: trip._id },
        { $set: { order: i } }
      );
    }
    const stops = await Stop.find({ tripId: trip._id }).sort({ order: 1 }).populate('cityId').populate('activities');
    res.json({ success: true, stops });
  } catch (err) {
    next(err);
  }
};

export const addActivityToStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const stop = await Stop.findOne({ _id: req.params.stopId, tripId: trip._id });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    const { activityId } = req.body;
    if (!activityId) {
      return res.status(400).json({ success: false, message: 'activityId required' });
    }
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found' });
    }
    if (!stop.activities.some((a) => a.toString() === activity._id.toString())) {
      stop.activities.push(activity._id);
      await stop.save();
    }
    const populated = await Stop.findById(stop._id).populate('activities').populate('cityId');
    res.status(201).json({ success: true, stop: populated });
  } catch (err) {
    next(err);
  }
};

export const removeActivityFromStop = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const stop = await Stop.findOne({ _id: req.params.stopId, tripId: trip._id });
    if (!stop) {
      return res.status(404).json({ success: false, message: 'Stop not found' });
    }
    stop.activities = stop.activities.filter((a) => a.toString() !== req.params.actId);
    await stop.save();
    const populated = await Stop.findById(stop._id).populate('activities').populate('cityId');
    res.json({ success: true, stop: populated });
  } catch (err) {
    next(err);
  }
};
