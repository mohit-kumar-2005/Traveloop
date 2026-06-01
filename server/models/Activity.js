import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'shopping'],
    required: true,
  },
  estimatedCost: { type: Number, default: 0, min: 0 },
  duration: { type: Number, default: 1, min: 0.5 },
  image: { type: String, default: '' },
  rating: { type: Number, min: 0, max: 5, default: 4 },
});

export default mongoose.model('Activity', activitySchema);
