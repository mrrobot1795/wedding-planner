import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  notes: string;
  contractSigned: boolean;
  depositPaid: boolean;
  finalPaymentPaid: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Venue',
        'Catering',
        'Photography',
        'Videography',
        'Florist',
        'Music',
        'Decor',
        'Transportation',
        'Stationery',
        'Bakery',
        'Attire',
        'Beauty',
        'Other',
      ],
    },
    contactName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    website: { type: String, default: '' },
    address: { type: String, default: '' },
    notes: { type: String, default: '' },
    contractSigned: { type: Boolean, default: false },
    depositPaid: { type: Boolean, default: false },
    finalPaymentPaid: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Vendor ||
  mongoose.model<IVendor>('Vendor', VendorSchema);
