import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      unique: true,
    },
    transport: { type: Number, default: 0, min: 0 },
    accommodation: { type: Number, default: 0, min: 0 },
    activities: { type: Number, default: 0, min: 0 },
    meals: { type: Number, default: 0, min: 0 },
    miscellaneous: { type: Number, default: 0, min: 0 },
    dailyLimit: { type: Number, default: 0, min: 0 },
    costPerPersonMultiplier: { type: Number, default: 1, min: 0.1 },
  },
  { timestamps: true }
);

budgetSchema.virtual('totalBudget').get(function () {
  return (
    this.transport +
    this.accommodation +
    this.activities +
    this.meals +
    this.miscellaneous
  );
});

budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

export default mongoose.model('Budget', budgetSchema);
