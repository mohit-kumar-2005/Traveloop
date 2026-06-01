import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    label: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['clothing', 'documents', 'electronics', 'toiletries', 'other'],
      default: 'other',
    },
    isPacked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('ChecklistItem', checklistItemSchema);
