import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfilePhoto {
  url: string;
  publicId: string;
  isPrimary: boolean;
}

export interface IProfile extends Document {
  userId: Types.ObjectId;
  displayName: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  city: string;
  state?: string;
  bio: string;
  interests: string[];
  occupation?: string;
  education?: string;
  languages: string[];
  relationshipPreference?: string;
  avatarUrl?: string;
  cloudinaryPublicId?: string;
  photos: IProfilePhoto[];
  contactSharing: boolean;
  shareableContact?: string;
  unlockPrice?: number;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [18, 'Must be at least 18 years old'],
      max: [100, 'Invalid age'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'other'],
      default: 'female',
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    interests: {
      type: [String],
      default: [],
      index: true,
    },
    occupation: {
      type: String,
      trim: true,
      default: '',
    },
    education: {
      type: String,
      trim: true,
      default: '',
    },
    languages: {
      type: [String],
      default: ['English'],
    },
    relationshipPreference: {
      type: String,
      default: 'Meaningful Relationship',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    contactSharing: {
      type: Boolean,
      default: false,
    },
    shareableContact: {
      type: String,
      trim: true,
      default: '',
    },
    unlockPrice: {
      type: Number,
      default: 399,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
