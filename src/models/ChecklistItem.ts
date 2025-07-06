import mongoose, { Schema, Document } from 'mongoose';

export interface IChecklist extends Document {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  assignedToEmail?: string;
  assignedBy?: string;
  assignedAt?: Date;
  notes: string;
  emailSent?: boolean;
  emailSentAt?: Date;
  completedAt?: Date;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
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
    assignedToEmail: { type: String },
    assignedBy: { type: String },
    assignedAt: { type: Date },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.ChecklistItem ||
  mongoose.model<IChecklist>('ChecklistItem', ChecklistItemSchema);
