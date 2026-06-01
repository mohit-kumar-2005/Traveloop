import Trip from '../models/Trip.js';

export const listPublicTrips = async (req, res, next) => {
  try {
    const { sort = 'recent', search, page = 1, limit = 12 } = req.query;
    const filter = { isPublic: true };
    if (search) {
      filter.title = new RegExp(search, 'i');
    }
    let sortOpt = { createdAt: -1 };
    if (sort === 'popular') sortOpt = { likes: -1, saves: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [trips, total] = await Promise.all([
      Trip.find(filter)
        .sort(sortOpt)
        .skip(skip)
        .limit(Number(limit))
        .populate('userId', 'name photo')
        .populate({
          path: 'stops',
          select: 'cityName country arrivalDate departureDate',
          populate: { path: 'cityId', select: 'coverImage coordinates' },
        }),
      Trip.countDocuments(filter),
    ]);
    res.json({
      success: true,
      trips,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const likeTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, isPublic: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    trip.likes = (trip.likes || 0) + 1;
    await trip.save();
    res.json({ success: true, likes: trip.likes });
  } catch (err) {
    next(err);
  }
};

export const saveTripBookmark = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, isPublic: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    trip.saves = (trip.saves || 0) + 1;
    await trip.save();
    res.json({ success: true, saves: trip.saves });
  } catch (err) {
    next(err);
  }
};
