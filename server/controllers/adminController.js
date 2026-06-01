import User from '../models/User.js';
import Trip from '../models/Trip.js';
import City from '../models/City.js';
import Activity from '../models/Activity.js';

export const getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const [totalUsers, totalTrips, tripsThisMonth] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      Trip.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);
    const ongoingTrips = await Trip.countDocuments({ status: 'ongoing' });
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTrips,
        tripsThisMonth,
        activeNow: ongoingTrips,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    const withCounts = await Promise.all(
      users.map(async (u) => {
        const tripsCount = await Trip.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          tripsCount,
        };
      })
    );
    res.json({ success: true, users: withCounts });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    }
    await Trip.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

export const promoteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.role = 'admin';
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const listAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find()
      .populate('userId', 'name email photo')
      .sort({ createdAt: -1 })
      .limit(200);
    res.json({ success: true, trips });
  } catch (err) {
    next(err);
  }
};

export const adminPopularCities = async (req, res, next) => {
  try {
    const cities = await City.find().sort({ popularity: -1 }).limit(10);
    res.json({ success: true, cities });
  } catch (err) {
    next(err);
  }
};

export const adminPopularActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('cityId')
      .sort({ rating: -1, estimatedCost: -1 })
      .limit(20);
    res.json({ success: true, activities });
  } catch (err) {
    next(err);
  }
};

export const tripsPerMonth = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    const trips = await Trip.find({ createdAt: { $gte: twelveMonthsAgo } });
    const buckets = {};
    for (let i = 0; i < 12; i++) {
      const d = new Date(twelveMonthsAgo);
      d.setMonth(twelveMonthsAgo.getMonth() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets[key] = 0;
    }
    trips.forEach((t) => {
      const d = new Date(t.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (buckets[key] !== undefined) buckets[key]++;
    });
    res.json({ success: true, series: buckets });
  } catch (err) {
    next(err);
  }
};

export const userSignupsOverTime = async (req, res, next) => {
  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    const users = await User.find({ createdAt: { $gte: twelveMonthsAgo } });
    const buckets = {};
    for (let i = 0; i < 12; i++) {
      const d = new Date(twelveMonthsAgo);
      d.setMonth(twelveMonthsAgo.getMonth() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets[key] = 0;
    }
    users.forEach((u) => {
      const d = new Date(u.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (buckets[key] !== undefined) buckets[key]++;
    });
    res.json({ success: true, series: buckets });
  } catch (err) {
    next(err);
  }
};

export const tripStatusDistribution = async (req, res, next) => {
  try {
    const [upcoming, ongoing, completed] = await Promise.all([
      Trip.countDocuments({ status: 'upcoming' }),
      Trip.countDocuments({ status: 'ongoing' }),
      Trip.countDocuments({ status: 'completed' }),
    ]);
    res.json({
      success: true,
      distribution: { upcoming, ongoing, completed },
    });
  } catch (err) {
    next(err);
  }
};
