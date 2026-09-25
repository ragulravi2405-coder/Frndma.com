import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILike extends Document {
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

LikeSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

export const Like = mongoose.model<ILike>('Like', LikeSchema);
