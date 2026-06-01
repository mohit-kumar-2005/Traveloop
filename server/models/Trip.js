import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const slugAlphabet = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    coverPhoto: { type: String, default: '' },
    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, unique: true, sparse: true },
    totalBudget: { type: Number, default: 0 },
    stops: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stop' }],
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

tripSchema.pre('save', function (next) {
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  if (now < start) this.status = 'upcoming';
  else if (now > end) this.status = 'completed';
  else this.status = 'ongoing';
  if (this.isPublic && !this.publicSlug) {
    this.publicSlug = slugAlphabet();
  }
  if (!this.isPublic) {
    this.publicSlug = undefined;
  }
  next();
});

export default mongoose.model('Trip', tripSchema);
