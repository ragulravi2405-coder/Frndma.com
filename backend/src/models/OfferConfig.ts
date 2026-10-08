import mongoose, { Document, Schema } from 'mongoose';

export interface IOfferConfig extends Document {
  offerKey: string;
  title: string;
  subtitle: string;
  price: number;
  credits: number;
  expiresAt: Date;
  isActive: boolean;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OfferConfigSchema = new Schema<IOfferConfig>(
  {
    offerKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: 'special_999',
    },
    title: {
      type: String,
      default: 'LIMITED TIME OFFER',
    },
    subtitle: {
      type: String,
      default: 'Unlock 3 Verified Contacts for ₹999',
    },
    price: {
      type: Number,
      default: 999,
    },
    credits: {
      type: Number,
      default: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [
        '3 contact unlocks',
        'Verified profiles',
        'Direct meeting allowed',
        'Video call allowed',
        'No extra payment for direct meeting/video call',
      ],
    },
  },
  {
    timestamps: true,
  }
);

export const OfferConfig = mongoose.model<IOfferConfig>('OfferConfig', OfferConfigSchema);
