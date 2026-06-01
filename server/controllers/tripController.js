import Trip from '../models/Trip.js';
import Stop from '../models/Stop.js';
import Budget from '../models/Budget.js';
import ChecklistItem from '../models/ChecklistItem.js';
import Note from '../models/Note.js';
import Activity from '../models/Activity.js';
import City from '../models/City.js';
import User from '../models/User.js';
import { customAlphabet } from 'nanoid';

const slugAlphabet = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

const refreshTripStatus = (trip) => {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  if (now < start) trip.status = 'upcoming';
  else if (now > end) trip.status = 'completed';
  else trip.status = 'ongoing';
};

export const getTrips = async (req, res, next) => {
  try {
    const { status, sort } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'all') filter.status = status;
    let sortOpt = { createdAt: -1 };
    if (sort === 'startDate') sortOpt = { startDate: 1 };
    if (sort === 'name') sortOpt = { title: 1 };
    const trips = await Trip.find(filter)
      .sort(sortOpt)
      .populate({
        path: 'stops',
        select: 'cityName country arrivalDate departureDate order',
      });
    res.json({ success: true, trips });
  } catch (err) {
    next(err);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      coverPhoto,
      isPublic,
      totalBudget,
    } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Title and dates are required' });
    }
    const tripData = {
      userId: req.user._id,
      title,
      description: description || '',
      startDate,
      endDate,
      coverPhoto: coverPhoto || '',
      isPublic: Boolean(isPublic),
      totalBudget: Number(totalBudget) || 0,
    };
    if (tripData.isPublic) {
      tripData.publicSlug = slugAlphabet();
    }
    const trip = await Trip.create(tripData);
    await Budget.create({ tripId: trip._id });
    const populated = await Trip.findById(trip._id).populate('stops');
    res.status(201).json({ success: true, trip: populated });
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    })
      .populate({
        path: 'stops',
        populate: [
          { path: 'cityId', model: 'City' },
          { path: 'activities', model: 'Activity' },
        ],
      });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    res.json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const {
      title,
      description,
      startDate,
      endDate,
      coverPhoto,
      isPublic,
      totalBudget,
    } = req.body;
    if (title !== undefined) trip.title = title;
    if (description !== undefined) trip.description = description;
    if (startDate) trip.startDate = startDate;
    if (endDate) trip.endDate = endDate;
    if (coverPhoto !== undefined) trip.coverPhoto = coverPhoto;
    if (totalBudget !== undefined) trip.totalBudget = Number(totalBudget);
    if (isPublic !== undefined) {
      trip.isPublic = Boolean(isPublic);
      if (trip.isPublic && !trip.publicSlug) trip.publicSlug = slugAlphabet();
      if (!trip.isPublic) trip.publicSlug = undefined;
    }
    refreshTripStatus(trip);
    await trip.save();
    const populated = await Trip.findById(trip._id).populate({
      path: 'stops',
      populate: [
        { path: 'cityId', model: 'City' },
        { path: 'activities', model: 'Activity' },
      ],
    });
    res.json({ success: true, trip: populated });
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    await Stop.deleteMany({ tripId: trip._id });
    await Budget.deleteOne({ tripId: trip._id });
    await ChecklistItem.deleteMany({ tripId: trip._id });
    await Note.deleteMany({ tripId: trip._id });
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip removed' });
  } catch (err) {
    next(err);
  }
};

export const getPublicTripBySlug = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ publicSlug: req.params.slug, isPublic: true })
      .populate('userId', 'name photo')
      .populate({
        path: 'stops',
        populate: [
          { path: 'cityId', model: 'City' },
          { path: 'activities', model: 'Activity' },
        ],
      });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Itinerary not found' });
    }
    res.json({ success: true, trip });
  } catch (err) {
    next(err);
  }
};

export const duplicateTrip = async (req, res, next) => {
  try {
    const source = await Trip.findById(req.params.id).populate({
      path: 'stops',
      populate: [{ path: 'activities' }],
    });
    if (!source) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const isOwner = source.userId.toString() === req.user._id.toString();
    if (!isOwner && !source.isPublic) {
      return res.status(403).json({ success: false, message: 'Cannot copy this trip' });
    }
    const newTrip = await Trip.create({
      userId: req.user._id,
      title: `${source.title} (Copy)`,
      description: source.description,
      startDate: source.startDate,
      endDate: source.endDate,
      coverPhoto: source.coverPhoto,
      isPublic: false,
      totalBudget: source.totalBudget,
    });
    await Budget.create({ tripId: newTrip._id });
    const stopIds = [];
    for (let i = 0; i < (source.stops || []).length; i++) {
      const s = source.stops[i];
      const stop = await Stop.create({
        tripId: newTrip._id,
        cityId: s.cityId,
        cityName: s.cityName,
        country: s.country,
        arrivalDate: s.arrivalDate,
        departureDate: s.departureDate,
        activities: s.activities?.map((a) => a._id || a) || [],
        notes: s.notes,
        stopBudget: s.stopBudget,
        order: i,
      });
      stopIds.push(stop._id);
    }
    newTrip.stops = stopIds;
    await newTrip.save();
    const populated = await Trip.findById(newTrip._id).populate({
      path: 'stops',
      populate: [
        { path: 'cityId', model: 'City' },
        { path: 'activities', model: 'Activity' },
      ],
    });
    res.status(201).json({ success: true, trip: populated });
  } catch (err) {
    next(err);
  }
};
