import Note from '../models/Note.js';
import Trip from '../models/Trip.js';

export const getNotes = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const notes = await Note.find({ tripId: trip._id, userId: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json({ success: true, notes });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const { content, stopId } = req.body;
    const note = await Note.create({
      tripId: trip._id,
      userId: req.user._id,
      content: content || '',
      stopId: stopId || null,
    });
    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    const note = await Note.findOne({
      _id: req.params.noteId,
      tripId: trip._id,
      userId: req.user._id,
    });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    const { content, stopId } = req.body;
    if (content !== undefined) note.content = content;
    if (stopId !== undefined) note.stopId = stopId || null;
    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

export const deleteNote = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found' });
    }
    await Note.deleteOne({
      _id: req.params.noteId,
      tripId: trip._id,
      userId: req.user._id,
    });
    res.json({ success: true, message: 'Note removed' });
  } catch (err) {
    next(err);
  }
};
