export interface User {
  id: string;
  username: string;
  mobileNumber: string;
  role: 'user' | 'admin';
  isAgeConfirmed: boolean;
  createdAt?: string;
}

export interface Profile {
  id?: string;
  userId: string;
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
  photos?: Array<{ url: string; publicId: string; isPrimary: boolean }>;
  contactSharing?: boolean;
  shareableContact?: string;
  isProfileComplete?: boolean;
  isOnline?: boolean;
  lastActive?: string;
  isContactUnlocked?: boolean;
  contactMessage?: string;
}

export interface MatchItem {
  matchId: string;
  lastMessage?: string;
  lastMessageAt?: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    age: number;
    city: string;
    isOnline: boolean;
    lastActive?: string;
  };
}

export interface MessageItem {
  _id: string;
  matchId: string;
  senderId: string;
  recipientId: string;
  text: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
}

export interface PlanItem {
  _id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  order: number;
}
