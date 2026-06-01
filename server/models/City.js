import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  region: {
    type: String,
    enum: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'],
    required: true,
  },
  description: { type: String, default: '' },
  costIndex: { type: Number, min: 1, max: 5, default: 3 },
  popularity: { type: Number, default: 0 },
  coverImage: { type: String, default: '' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  tags: [{ type: String }],
});

citySchema.index({ name: 'text', country: 'text', description: 'text' });

export default mongoose.model('City', citySchema);
