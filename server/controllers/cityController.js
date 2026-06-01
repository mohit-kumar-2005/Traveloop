import City from '../models/City.js';

export const listCities = async (req, res, next) => {
  try {
    const { search, region, page = 1, limit = 12, sort } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { country: new RegExp(search, 'i') },
      ];
    }
    if (region && region !== 'All') {
      filter.region = region;
    }
    let sortOpt = { popularity: -1 };
    if (sort === 'cost') sortOpt = { costIndex: 1 };
    if (sort === 'name') sortOpt = { name: 1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [cities, total] = await Promise.all([
      City.find(filter).sort(sortOpt).skip(skip).limit(Number(limit)),
      City.countDocuments(filter),
    ]);
    res.json({
      success: true,
      cities,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      total,
    });
  } catch (err) {
    next(err);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    res.json({ success: true, city });
  } catch (err) {
    next(err);
  }
};

export const popularCities = async (req, res, next) => {
  try {
    const cities = await City.find().sort({ popularity: -1 }).limit(12);
    res.json({ success: true, cities });
  } catch (err) {
    next(err);
  }
};
