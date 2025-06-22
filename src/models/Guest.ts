import mongoose, { Schema, Document } from 'mongoose';

export interface IGuest extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  additionalGuests: number;
  rsvpStatus: 'pending' | 'confirmed' | 'declined';
  dietaryRestrictions: string;
  group: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    additionalGuests: { type: Number, default: 0, min: 0, max: 10 },
    rsvpStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'declined'],
      default: 'pending',
    },
    dietaryRestrictions: { type: String, default: '' },
    group: { type: String, default: 'Guest' }, // e.g., Family, Friend, Colleague
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export default mongoose.models.Guest ||
  mongoose.model<IGuest>('Guest', GuestSchema);
