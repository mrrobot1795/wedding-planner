import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklist extends Document {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    category: {
      type: String,
      required: true,
      enum: [
        'Venue',
        'Catering',
        'Beauty',
        'Attire',
        'Ceremony',
        'Reception',
        'Gifts',
        'Honeymoon',
        'Legal',
        'Other',
      ],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.ChecklistItem ||
  mongoose.model<IChecklist>('ChecklistItem', ChecklistItemSchema);
