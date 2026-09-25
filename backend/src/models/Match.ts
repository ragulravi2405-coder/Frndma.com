import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMatch extends Document {
  users: Types.ObjectId[];
  lastMessage?: string;
  lastMessageAt?: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ users: 1 });

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
