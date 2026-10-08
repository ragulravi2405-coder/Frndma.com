import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserContactCredits extends Document {
  userId: Types.ObjectId;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  lastPurchasedAt?: Date;
  history: Array<{
    action: 'purchased' | 'used';
    amount?: number;
    profileOwnerId?: Types.ObjectId;
    timestamp: Date;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserContactCreditsSchema = new Schema<IUserContactCredits>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    usedCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingCredits: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPurchasedAt: {
      type: Date,
    },
    history: [
      {
        action: {
          type: String,
          enum: ['purchased', 'used'],
          required: true,
        },
        amount: {
          type: Number,
          default: 1,
        },
        profileOwnerId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const UserContactCredits = mongoose.model<IUserContactCredits>(
  'UserContactCredits',
  UserContactCreditsSchema
);
