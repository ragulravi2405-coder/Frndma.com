import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IContactUnlock extends Document {
  userId: Types.ObjectId; // User who bought the unlock
  profileOwnerId: Types.ObjectId; // Profile whose contact is unlocked
  paymentId?: string;
  orderId?: string;
  status: 'unlocked' | 'expired' | 'revoked';
  unlockedAt: Date;
  expiresAt?: Date;
  createdAt: Date;
}

const ContactUnlockSchema = new Schema<IContactUnlock>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    profileOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    paymentId: {
      type: String,
      default: '',
    },
    orderId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['unlocked', 'expired', 'revoked'],
      default: 'unlocked',
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

ContactUnlockSchema.index({ userId: 1, profileOwnerId: 1 }, { unique: true });

export const ContactUnlock = mongoose.model<IContactUnlock>('ContactUnlock', ContactUnlockSchema);
