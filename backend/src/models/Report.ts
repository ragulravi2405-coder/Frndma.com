import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IReport extends Document {
  reportedBy: Types.ObjectId;
  reportedUser: Types.ObjectId;
  reason: 'spam' | 'fake_profile' | 'harassment' | 'scam' | 'inappropriate_content' | 'privacy_violation' | 'other';
  details: string;
  status: 'pending' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reportedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      enum: ['spam', 'fake_profile', 'harassment', 'scam', 'inappropriate_content', 'privacy_violation', 'other'],
      required: true,
    },
    details: {
      type: String,
      maxlength: [1000, 'Details cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
