import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetItem extends Document {
  category: string;
  description: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  paymentDate?: Date;
  vendor?: Schema.Types.ObjectId;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetItemSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'Venue',
        'Catering',
        'Photography',
        'Videography',
        'Attire',
        'Flowers',
        'Music',
        'Decor',
        'Transportation',
        'Stationery',
        'Gifts',
        'Other',
      ],
    },
    description: { type: String, required: true },
    estimatedCost: { type: Number, required: true, default: 0 },
    actualCost: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    paymentDate: { type: Date },
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.BudgetItem ||
  mongoose.model<IBudgetItem>('BudgetItem', BudgetItemSchema);
