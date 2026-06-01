import bcrypt from 'bcryptjs';
import cloudinary from '../config/cloudinary.js';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import City from '../models/City.js';
import ChecklistItem from '../models/ChecklistItem.js';
import Note from '../models/Note.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('savedDestinations');
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, phone, city, country, language, isProfilePublic, photo } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (city !== undefined) user.city = city;
    if (country !== undefined) user.country = country;
    if (language !== undefined) user.language = language;
    if (isProfilePublic !== undefined) user.isProfilePublic = Boolean(isProfilePublic);
    if (photo !== undefined) user.photo = photo;
    await user.save();
    const populated = await User.findById(user._id).populate('savedDestinations');
    res.json({ success: true, user: populated });
  } catch (err) {
    next(err);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    await Trip.deleteMany({ userId });
    await ChecklistItem.deleteMany({ userId });
    await Note.deleteMany({ userId });
    await User.findByIdAndDelete(userId);
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Passwords required' });
    }
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    next(err);
  }
};

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'No image file' });
    }
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'traveloop/profiles',
    });
    const user = await User.findById(req.user._id);
    user.photo = result.secure_url;
    await user.save();
    res.json({ success: true, photo: user.photo });
  } catch (err) {
    next(err);
  }
};

export const saveDestination = async (req, res, next) => {
  try {
    const { cityId } = req.body;
    if (!cityId) {
      return res.status(400).json({ success: false, message: 'cityId required' });
    }
    const city = await City.findById(cityId);
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    const user = await User.findById(req.user._id);
    const exists = user.savedDestinations.some((id) => id.toString() === cityId);
    if (!exists) user.savedDestinations.push(cityId);
    await user.save();
    const populated = await User.findById(user._id).populate('savedDestinations');
    res.json({ success: true, user: populated });
  } catch (err) {
    next(err);
  }
};

export const removeSavedDestination = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const user = await User.findById(req.user._id);
    user.savedDestinations = user.savedDestinations.filter((id) => id.toString() !== cityId);
    await user.save();
    const populated = await User.findById(user._id).populate('savedDestinations');
    res.json({ success: true, user: populated });
  } catch (err) {
    next(err);
  }
};
