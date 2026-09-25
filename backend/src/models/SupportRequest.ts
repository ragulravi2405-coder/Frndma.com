import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISupportRequest extends Document {
  userId?: Types.ObjectId;
  name: string;
  contact: string;
  message: string;
  channel: 'whatsapp' | 'web';
  status: 'open' | 'in_progress' | 'closed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SupportRequestSchema = new Schema<ISupportRequest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    channel: {
      type: String,
      enum: ['whatsapp', 'web'],
      default: 'whatsapp',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'closed'],
      default: 'open',
      index: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const SupportRequest = mongoose.model<ISupportRequest>('SupportRequest', SupportRequestSchema);
