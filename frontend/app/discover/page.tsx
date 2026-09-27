'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  MapPin,
  Lock,
  Unlock,
  Eye,
  SlidersHorizontal,
  Phone,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { PaymentModal } from '@/components/PaymentModal';

/**
 * ============================================================================
 * 🌸 5 GIRLS DISCOVER PROFILES CONFIGURATION (CHANGE CODE HERE) 🌸
 * ============================================================================
 * 📌 TAMIL / TANGLISH GUIDE:
 * Intha 5 edathula neenga unga 5 girls images & details change pannikkalam!
 * 1. avatarUrl -> Girls photo link (Unsplash, Cloudinary, etc.)
 * 2. shareableContact -> Girls WhatsApp / Phone number
 * 3. displayName, age, city, bio -> Profile details
 * ============================================================================
 */
const DISCOVER_5_GIRLS_LIST = [
  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 1] - PRIYA (Chennai, Tamil Nadu) - Lush Green Bush
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_1',
    userId: 'girl_user_1',
    displayName: 'Priya',
    age: 22,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'Software Engineer',
    bio: 'Greenery lover, nature walks, warm smiles, and meaningful conversations. Looking to connect with kind souls! 🌿',
    interests: ['Nature', 'Music', 'Coffee', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1689580298851-d4482a124290?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543211',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 2] - ANANYA (Bangalore, Karnataka) - Black Dress Posing
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_2',
    userId: 'girl_user_2',
    displayName: 'Ananya',
    age: 24,
    city: 'Bangalore',
    state: 'Karnataka',
    occupation: 'UI/UX Designer',
    bio: 'Indiranagar explorer, product designer by day, indie gig & cafe hopper on weekends. Let’s connect! ☕',
    interests: ['Design', 'Cafes', 'Indie Music', 'Art'],
    avatarUrl: 'https://images.unsplash.com/photo-1710972197951-3aade7376076?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543212',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 3] - DR. MEERA (Kochi, Kerala) - Red & Black Clothing
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_3',
    userId: 'girl_user_3',
    displayName: 'Dr. Meera',
    age: 25,
    city: 'Kochi',
    state: 'Kerala',
    occupation: 'Dental Surgeon',
    bio: 'Malayali penne with a cheerful smile! Doctor, Kathakali enthusiast, and coastal sunset admirer. 🌸',
    interests: ['Classical Dance', 'Medicine', 'Sunsets', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1761125135357-99cbe52a6271?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543213',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 4] - SNEHA (Coimbatore, Tamil Nadu) - Purple Top Fence
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_4',
    userId: 'girl_user_4',
    displayName: 'Sneha',
    age: 23,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    occupation: 'Content Creator',
    bio: 'Siruvani breeze lover, weekend road trips across Western Ghats, fond of cozy cafes and laughter! 💜',
    interests: ['Road Trips', 'Photography', 'Vlogging', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967795578-81e7669b2185?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543214',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 5] - KAVYA (Bangalore, Karnataka) - Black & White Saree
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_5',
    userId: 'girl_user_5',
    displayName: 'Kavya',
    age: 26,
    city: 'Bangalore',
    state: 'Karnataka',
    occupation: 'Growth Marketer',
    bio: 'Koramangala girl, startup marketer, loves handloom sarees, books, and rooftop acoustics. 🪷',
    interests: ['Startups', 'Sarees', 'Literature', 'Acoustic'],
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1691030255899-cccde3a4e04f?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543215',
    unlockPrice: 799,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 6] - REVATHI (Madurai, Tamil Nadu) - Temple Portrait
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_6',
    userId: 'girl_user_6',
    displayName: 'Revathi',
    age: 25,
    city: 'Madurai',
    state: 'Tamil Nadu',
    occupation: 'Dance Instructor',
    bio: 'Traditional soul with a modern heartbeat. Bharatanatyam artist, Madurai Meenakshi temple devotee. ✨',
    interests: ['Bharatanatyam', 'Heritage', 'Temple Art', 'Poetry'],
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1726873351723-cb980a1d6dcb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543216',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 7] - APARNA (Trivandrum, Kerala) - Red & Black Dress Tree
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_7',
    userId: 'girl_user_7',
    displayName: 'Aparna',
    age: 24,
    city: 'Trivandrum',
    state: 'Kerala',
    occupation: 'High School Educator',
    bio: 'Nature lover from Kerala’s capital. Passionate about literature, beach strolls at Kovalam & true vibes. 🌿',
    interests: ['Teaching', 'Beaches', 'Novels', 'Planting'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967074857-d5c6d53d926b?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543217',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 8] - RITHIKA (Chennai, Tamil Nadu) - Red Sari Front of Door (Hot Fashion Stylist)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_8',
    userId: 'girl_user_8',
    displayName: 'Rithika',
    age: 23,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'Fashion Stylist',
    bio: 'Besant Nagar beach sunset lover, fashion stylist, and vintage aesthetic collector. Let’s talk! ❤️',
    interests: ['Fashion', 'Photography', 'Cafes', 'Beaches'],
    avatarUrl: 'https://images.unsplash.com/photo-1738853941039-b3d49beb16aa?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543218',
    unlockPrice: 899,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 9] - DEVIKA (Alleppey, Kerala) - Saree Sits on Boat
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_9',
    userId: 'girl_user_9',
    displayName: 'Devika',
    age: 26,
    city: 'Alleppey',
    state: 'Kerala',
    occupation: 'Ayurvedic Doctor',
    bio: 'Backwaters, tranquil houseboats, Ayurveda practitioner and lover of peaceful melodies. 🚣‍♀️',
    interests: ['Wellness', 'Houseboats', 'Nature', 'Meditation'],
    avatarUrl: 'https://images.unsplash.com/photo-1747993114347-7a4a9d454e22?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543219',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 10] - DIVYA (Bangalore, Karnataka) - Green & Brown Talking on Phone
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_10',
    userId: 'girl_user_10',
    displayName: 'Divya',
    age: 27,
    city: 'Bangalore',
    state: 'Karnataka',
    occupation: 'Senior HR Specialist',
    bio: 'Tech park busy bee in Whitefield! Loves fitness, weekend getaways to Nandi Hills, and hearty laughs. 📱',
    interests: ['Fitness', 'Trekking', 'Podcasts', 'Networking'],
    avatarUrl: 'https://images.unsplash.com/photo-1641877953739-8cab85119201?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543220',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 11] - MALAVIKA (Kozhikode, Kerala) - Smiling for Camera
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_11',
    userId: 'girl_user_11',
    displayName: 'Malavika',
    age: 22,
    city: 'Kozhikode',
    state: 'Kerala',
    occupation: 'Architectural Intern',
    bio: 'Malabar biryani enthusiast, architecture student, loves sketching old town buildings and rainy days. ☕',
    interests: ['Sketching', 'Rain', 'Architecture', 'Foodie'],
    avatarUrl: 'https://images.unsplash.com/photo-1669829508691-8ce630261b7b?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543221',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 12] - SHALINI (Tiruchirappalli, Tamil Nadu) - Long Hair Portrait
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_12',
    userId: 'girl_user_12',
    displayName: 'Shalini',
    age: 24,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    occupation: 'Financial Analyst',
    bio: 'Rockfort city girl with a vibrant outlook. Numbers lover by profession, watercolor artist at heart. 🎨',
    interests: ['Painting', 'Economics', 'Badminton', 'Movies'],
    avatarUrl: 'https://images.unsplash.com/photo-1669829586323-0aa141a664cc?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543222',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 13] - KEERTHANA (Bangalore, Karnataka) - Cosplay / Anime Fan (Hot Glamorous)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_13',
    userId: 'girl_user_13',
    displayName: 'Keerthana',
    age: 23,
    city: 'Bangalore',
    state: 'Karnataka',
    occupation: 'Motion & Visual Designer',
    bio: 'HSR Layout girl! Anime, comic-con, creative design, and late night cold coffees. Hit me up! 🖤',
    interests: ['Anime', 'Cosplay', 'Gaming', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1788022164447-c491541fe0a0?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543223',
    unlockPrice: 999,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 14] - NANDHINI (Salem, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_14',
    userId: 'girl_user_14',
    displayName: 'Nandhini',
    age: 23,
    city: 'Salem',
    state: 'Tamil Nadu',
    occupation: 'Graphic Artist',
    bio: 'Simple, sweet and nature enthusiast from Salem. Loves photography, warm coffee, and genuine conversations. 🌸',
    interests: ['Photography', 'Music', 'Nature', 'Travel'],
    avatarUrl: '/profiles/girl_14.jpg',
    shareableContact: '9876543224',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 15] - KEERTHI (Madurai, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_15',
    userId: 'girl_user_15',
    displayName: 'Keerthi',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    occupation: 'Software Developer',
    bio: 'Madurai girl with vibrant smile! Fond of traditional wear, spicy food, classical music, and long weekend drives. ✨',
    interests: ['Classical Music', 'Foodie', 'Road Trips', 'Books'],
    avatarUrl: '/profiles/girl_15.jpg',
    shareableContact: '9876543225',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 16] - DEEPIKA (Tirunelveli, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_16',
    userId: 'girl_user_16',
    displayName: 'Deepika',
    age: 22,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    occupation: 'Content Writer',
    bio: 'Halwa city girl! Loves scenic waterfalls at Courtallam, traditional sarees, and sharing good laughs. ❤️',
    interests: ['Literature', 'Waterfalls', 'Writing', 'Art'],
    avatarUrl: '/profiles/girl_16.jpg',
    shareableContact: '9876543226',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 17] - POOJA (Chennai, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_17',
    userId: 'girl_user_17',
    displayName: 'Pooja',
    age: 25,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'HR Manager',
    bio: 'Marina beach morning walks, filter coffee, indie films, and cozy rooftop evenings in Anna Nagar. ☕',
    interests: ['Cinema', 'Coffee', 'Beach', 'Fitness'],
    avatarUrl: '/profiles/girl_17.jpg',
    shareableContact: '9876543227',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 18] - SOWMYA (Erode, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_18',
    userId: 'girl_user_18',
    displayName: 'Sowmya',
    age: 23,
    city: 'Erode',
    state: 'Tamil Nadu',
    occupation: 'Fashion Merchandiser',
    bio: 'Bhavani river breezes, handloom silk sarees, simple lifestyle, and looking for a caring companion. 🥻',
    interests: ['Textiles', 'Cooking', 'Gardening', 'Music'],
    avatarUrl: '/profiles/girl_18.jpg',
    shareableContact: '9876543228',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 19] - LAKSHMI (Thanjavur, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_19',
    userId: 'girl_user_19',
    displayName: 'Lakshmi',
    age: 26,
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    occupation: 'Music Teacher',
    bio: 'Rooted in heritage and temple art. Loves Carnatic ragas, temple visits, and calm nature strolls. 🪷',
    interests: ['Carnatic Music', 'Heritage', 'Temples', 'Painting'],
    avatarUrl: '/profiles/girl_19.jpg',
    shareableContact: '9876543229',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 20] - SANDHYA (Coimbatore, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_20',
    userId: 'girl_user_20',
    displayName: 'Sandhya',
    age: 24,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    occupation: 'Digital Marketer',
    bio: 'Chill vibes, cafe hopper in Race Course, Marudhamalai road trips, and pleasant weekend conversations! 🌿',
    interests: ['Road Trips', 'Cafes', 'Podcasts', 'Baking'],
    avatarUrl: '/profiles/girl_20.jpg',
    shareableContact: '9876543230',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 21] - AARTHI (Trichy, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_21',
    userId: 'girl_user_21',
    displayName: 'Aarthi',
    age: 22,
    city: 'Trichy',
    state: 'Tamil Nadu',
    occupation: 'Interior Design Intern',
    bio: 'Rockfort city resident! Positive thinker, watercolor painter, and loves chatting about everyday wonders. 🎨',
    interests: ['Painting', 'Interior Design', 'Badminton', 'Movies'],
    avatarUrl: '/profiles/girl_21.jpg',
    shareableContact: '9876543231',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 22] - PAVITHRA (Vellore, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_22',
    userId: 'girl_user_22',
    displayName: 'Pavithra',
    age: 25,
    city: 'Vellore',
    state: 'Tamil Nadu',
    occupation: 'Research Analyst',
    bio: 'Modern girl with traditional values. Loves weekend baking, acoustic melodies, and long soulful chats. 🤍',
    interests: ['Research', 'Baking', 'Acoustic Music', 'Fitness'],
    avatarUrl: '/profiles/girl_22.jpg',
    shareableContact: '9876543232',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 23] - GAYATHRI (Dindigul, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_23',
    userId: 'girl_user_23',
    displayName: 'Gayathri',
    age: 23,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    occupation: 'School Teacher',
    bio: 'Kodaikanal mist lover! Enjoys hill station drives, spicy biryani, and meeting people with warm hearts. ⛰️',
    interests: ['Teaching', 'Mountains', 'Nature', 'Cooking'],
    avatarUrl: '/profiles/girl_23.jpg',
    shareableContact: '9876543233',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 24] - MONIKA (Kanyakumari, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_24',
    userId: 'girl_user_24',
    displayName: 'Monika',
    age: 24,
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    occupation: 'Tourism Consultant',
    bio: 'Ocean sunrise and sunset admirer from the edge of India! Calm, cheerful, and loves good music. 🌅',
    interests: ['Ocean', 'Travel', 'Sunsets', 'Yoga'],
    avatarUrl: '/profiles/girl_24.jpg',
    shareableContact: '9876543234',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 25] - SWETHA (Kanchipuram, Tamil Nadu)
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_25',
    userId: 'girl_user_25',
    displayName: 'Swetha',
    age: 25,
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    occupation: 'Fashion Stylist',
    bio: 'Silk city pride! Classical aesthetics, fond of ethnic fashion, saree designing, and deep conversations. ✨',
    interests: ['Fashion', 'Sarees', 'Photography', 'Heritage'],
    avatarUrl: '/profiles/girl_25.jpg',
    shareableContact: '9876543235',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 26] - PRIYA S. (Chennai, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_26',
    userId: 'girl_user_26',
    displayName: 'Priya S.',
    age: 21,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'UI Designer',
    bio: 'Coffee, books, travel and meaningful conversations. Looking forward to meeting pleasant people! ✨',
    interests: ['Travel', 'Music', 'Books', 'Food', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543227',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 27] - SNEHA M. (Madurai, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_27',
    userId: 'girl_user_27',
    displayName: 'Sneha M.',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    occupation: 'Digital Marketer',
    bio: 'Madurai girl with a cheerful smile, fashion lover, and weekend cafe explorer. Love genuine talks! 🤍',
    interests: ['Fashion', 'Photography', 'Food', 'Cafes'],
    avatarUrl: 'https://images.unsplash.com/photo-1646539741099-7ac3cc927e54?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543228',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 28] - KAVYA T. (Tiruchirappalli, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_28',
    userId: 'girl_user_28',
    displayName: 'Kavya T.',
    age: 22,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    occupation: 'Architect',
    bio: 'Classical saree lover, fond of traditional temple architecture and artistic photography. 🪷',
    interests: ['Architecture', 'Photography', 'Heritage', 'Reading'],
    avatarUrl: 'https://images.unsplash.com/photo-1729101146492-006e4d9c82f4?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543229',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 29] - RITHIKA V. (Tirunelveli, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_29',
    userId: 'girl_user_29',
    displayName: 'Rithika V.',
    age: 23,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    occupation: 'Graphic Designer',
    bio: 'Curly hair, chic sunglasses, and adventurous road trips. Sweet like Tirunelveli Halwa! 🕶️',
    interests: ['Design', 'Road Trips', 'Movies', 'Fashion'],
    avatarUrl: 'https://images.unsplash.com/photo-1784360432673-ad3f7727ef09?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543230',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 30] - SHALINI E. (Erode, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_30',
    userId: 'girl_user_30',
    displayName: 'Shalini E.',
    age: 26,
    city: 'Erode',
    state: 'Tamil Nadu',
    occupation: 'Botanist / Researcher',
    bio: 'Nature lover, passionate about eco-friendly living and peaceful greenery. Looking for true friendship. 🌿',
    interests: ['Nature', 'Gardening', 'Environment', 'Peace'],
    avatarUrl: 'https://images.unsplash.com/photo-1759854881836-53a85959f628?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543231',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 31] - NITHYA (Vellore, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_31',
    userId: 'girl_user_31',
    displayName: 'Nithya',
    age: 27,
    city: 'Vellore',
    state: 'Tamil Nadu',
    occupation: 'Financial Analyst',
    bio: 'Smart casual vibes, modern outlook, loves reading novels and long chats with thoughtful minds. 📖',
    interests: ['Reading', 'Economics', 'Podcasts', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1781551928573-cd7b9b7a433a?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543232',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 32] - DEEPA (Kanyakumari, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_32',
    userId: 'girl_user_32',
    displayName: 'Deepa',
    age: 29,
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    occupation: 'Marine Biologist',
    bio: 'Ocean lover, calm and thoughtful. Cherishing sunsets and sunrise at the southern tip of India. 🌊',
    interests: ['Ocean', 'Marine Life', 'Sunsets', 'Yoga'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967074923-2b3ebe6171c3?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543233',
    unlockPrice: 499,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 33] - REVATHI D. (Dindigul, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_33',
    userId: 'girl_user_33',
    displayName: 'Revathi D.',
    age: 31,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    occupation: 'College Professor',
    bio: 'Elegant, kind-hearted, and loves traditional cooking and family gatherings. Looking for meaningful bonds. 🥻',
    interests: ['Literature', 'Cooking', 'Teaching', 'Poetry'],
    avatarUrl: 'https://images.unsplash.com/photo-1735331467260-0153c5fbd31d?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543234',
    unlockPrice: 399,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 34] - POOJA (Chennai, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_34',
    userId: 'girl_user_34',
    displayName: 'Pooja',
    age: 23,
    city: 'Chennai',
    state: 'Tamil Nadu',
    occupation: 'Fashion Designer',
    bio: 'Marina beach evening walks, fashion designer, food enthusiast and cheerful companion! 🌸',
    interests: ['Fashion', 'Foodie', 'Beaches', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543235',
    unlockPrice: 599,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 35] - DR. MEERA C. (Coimbatore, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_35',
    userId: 'girl_user_35',
    displayName: 'Dr. Meera C.',
    age: 25,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    occupation: 'Physician',
    bio: 'Doctor with passion for yoga, Western Ghats road trips, and deep friendly conversations. 🩺',
    interests: ['Yoga', 'Healthcare', 'Road Trips', 'Reading'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543236',
    unlockPrice: 699,
    contactSharing: true,
  },

  // ──────────────────────────────────────────────────────────
  // 🌸 [GIRL 36] - KEERTHI K. (Madurai, Tamil Nadu) - Classic Unsplash
  // ──────────────────────────────────────────────────────────
  {
    id: 'girl_36',
    userId: 'girl_user_36',
    displayName: 'Keerthi K.',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    occupation: 'Software Engineer',
    bio: 'Techie girl from temple city. Love filter coffee, listening to melody tracks and weekend chill. ☕',
    interests: ['Music', 'Coffee', 'Movies', 'Tech'],
    avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543237',
    unlockPrice: 499,
    contactSharing: true,
  },
];


const getWhatsAppUrl = (contact: string, name: string) => {
  const clean = String(contact || '').replace(/\D/g, '');
  const finalNum = clean.length === 10 ? `91${clean}` : clean;
  return `https://wa.me/${finalNum}?text=${encodeURIComponent(`Hi ${name}, saw your profile on Frndma!`)}`;
};

export default function DiscoverPage() {
  const [profiles, setProfiles] = useState<any[]>(DISCOVER_5_GIRLS_LIST);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(40);
  const [city, setCity] = useState('');

  // Unlocked IDs list
  const [unlockedIds, setUnlockedIds] = useState<Record<string, string>>({});

  // Payment Modal state
  const [paymentData, setPaymentData] = useState<{
    isOpen: boolean;
    targetProfileId?: string;
    targetProfileName?: string;
    amount?: number;
  }>({
    isOpen: false,
  });

  // Quick View Profile Modal
  const [selectedProfile, setSelectedProfile] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [minAge, maxAge, city]);

  const loadData = async () => {
    setLoading(true);
    let query = `?minAge=${minAge}&maxAge=${maxAge}&gender=female&limit=100`;
    if (city) query += `&city=${encodeURIComponent(city)}`;

    const [profilesRes, unlocksRes] = await Promise.all([
      fetchApi(`/discover${query}`),
      fetchApi('/unlocks/my-unlocks'),
    ]);

    if (profilesRes.success && profilesRes.data && profilesRes.data.length > 0) {
      // Merge database profiles and DISCOVER_5_GIRLS_LIST seamlessly so ALL profiles are always shown
      const existingNames = new Set(profilesRes.data.map((p: any) => (p.displayName || '').toLowerCase()));
      const additional = DISCOVER_5_GIRLS_LIST.filter(
        (g) => !existingNames.has((g.displayName || '').toLowerCase())
      );
      setProfiles([...profilesRes.data, ...additional]);
    } else {
      // Default to the configured girls profiles if query has no database results or offline
      setProfiles(DISCOVER_5_GIRLS_LIST);
    }

    if (unlocksRes.success && unlocksRes.data) {
      const map: Record<string, string> = {};
      unlocksRes.data.forEach((u: any) => {
        map[u.profileOwnerId] = u.contactNumber;
      });
      setUnlockedIds(map);
    }

    setLoading(false);
  };

  const handleUnlockClick = (profile: any) => {
    setPaymentData({
      isOpen: true,
      targetProfileId: profile.userId || profile.id,
      targetProfileName: profile.displayName,
      amount: profile.unlockPrice || 399,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Female Profiles ({profiles.length})
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading mt-1">
            Discover Girls Profiles
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Browse verified Indian profiles. Tap any card to view full pictures and details.
          </p>
        </div>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
            filtersOpen
              ? 'bg-primary text-white border-primary shadow-glow-sm'
              : 'glass-card border-white/10 text-zinc-300 hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter by City / Age</span>
        </button>
      </div>

      {/* Filter Drawer */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 sm:p-6 rounded-3xl glass-card border border-primary/20 bg-[#140b1a] text-xs text-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-zinc-400 mb-2 font-semibold">
                Maximum Age: <span className="text-white font-bold">{maxAge} yrs</span>
              </label>
              <input
                type="range"
                min="18"
                max="50"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <label className="block text-zinc-400 mb-2 font-semibold">City</label>
              <input
                type="text"
                placeholder="Type city (e.g. Chennai, Bangalore, Madurai)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Profiles Small-Box Grid (2 Columns on Mobile, 3-5 on Desktop) */}
      {loading ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-400">Loading verified profiles...</span>
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5">
          {profiles.map((profile) => {
            const profileId = profile.userId || profile.id;
            const isUnlocked = !!unlockedIds[profileId];
            const unlockedNumber = unlockedIds[profileId] || profile.shareableContact;

            return (
              <motion.div
                key={profile.id || profile.username || profile.displayName}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl sm:rounded-3xl overflow-hidden glass-card border border-white/10 hover:border-primary/50 bg-[#120a17] transition-all shadow-glow-sm hover:shadow-glow-md flex flex-col justify-between group"
              >
                {/* Photo Area (Click to Open Details) */}
                <div
                  onClick={() => setSelectedProfile(profile)}
                  className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer"
                >
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120a17] via-transparent to-transparent" />

                  {/* Top Status Badges */}
                  <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] sm:text-[10px] font-semibold text-white flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Verified</span>
                  </div>

                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 flex items-center gap-1">
                    <div className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-primary to-rose-600 backdrop-blur-md border border-white/20 text-[10px] sm:text-[11px] font-extrabold text-white shadow-glow-sm">
                      ₹{profile.unlockPrice || 399}
                    </div>
                  </div>

                  {/* Card Bottom Details On Photo */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-3.5 sm:right-3.5 text-white">
                    <div className="flex items-baseline gap-1">
                      <h3 className="text-sm sm:text-base font-bold font-heading truncate">
                        {profile.displayName}
                      </h3>
                      <span className="text-xs sm:text-sm text-zinc-300">({profile.age})</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-zinc-300 flex items-center gap-0.5 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-primary shrink-0" />
                      <span className="truncate">{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
                    </p>
                  </div>
                </div>

                {/* Card Footer / Buttons */}
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <p className="text-[11px] text-zinc-400 italic line-clamp-1 mb-2 hidden sm:block">
                    &quot;{profile.bio || 'Love meeting real people and having pleasant conversations.'}&quot;
                  </p>

                  <div className="space-y-1.5">
                    {isUnlocked ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs px-2 py-0.5 bg-emerald-950/40 rounded-lg border border-emerald-500/30 text-emerald-300">
                          <span className="font-mono font-bold truncate">{unlockedNumber}</span>
                          <span className="text-[9px] uppercase font-bold text-emerald-400 shrink-0">Unlocked</span>
                        </div>
                        <a
                          href={getWhatsAppUrl(unlockedNumber, profile.displayName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-1.5 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleUnlockClick(profile)}
                        className="w-full py-1.5 sm:py-2 px-2 rounded-xl bg-gradient-to-r from-primary to-rose-600 hover:from-primary-hover hover:to-rose-500 text-white text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-glow-sm transition-all"
                      >
                        <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span>Unlock ₹{profile.unlockPrice || 399}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedProfile(profile)}
                      className="w-full py-1 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl glass-card border border-white/10 bg-[#120a17] max-w-md mx-auto p-8">
          <h3 className="text-xl font-bold text-white mb-2 font-heading">No Profiles Found</h3>
          <p className="text-xs text-zinc-400 mb-6">
            Try adjusting your age or city filter to see more profiles.
          </p>
          <button
            onClick={() => {
              setMaxAge(45);
              setCity('');
            }}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-glow-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Quick View Profile Modal */}
      {selectedProfile && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-card border border-primary/30 bg-[#140b1a] text-white shadow-glow-lg max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary shadow-glow-sm shrink-0">
                  <img
                    src={selectedProfile.avatarUrl}
                    alt={selectedProfile.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading">{selectedProfile.displayName}, {selectedProfile.age}</h3>
                  <p className="text-xs text-zinc-300 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>{selectedProfile.city}{selectedProfile.state ? `, ${selectedProfile.state}` : ''}</span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    {selectedProfile.occupation || 'Private Professional'}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5">
                <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-1">About Her</h4>
                <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &quot;{selectedProfile.bio || 'Love meeting real people and having pleasant conversations.'}&quot;
                </p>
              </div>

              {/* Interests */}
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-pink-400 font-bold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.interests?.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-pink-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Unlock Status in Modal */}
              <div className="p-5 rounded-2xl glass-card border border-primary/40 bg-gradient-to-br from-[#1e0e26] to-[#120a17]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Contact Status</span>
                  </div>
                  {unlockedIds[selectedProfile.userId] ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      LOCKED
                    </span>
                  )}
                </div>

                {unlockedIds[selectedProfile.userId] ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/40 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {unlockedIds[selectedProfile.userId]}
                      </span>
                      <a
                        href={getWhatsAppUrl(
                          unlockedIds[selectedProfile.userId] || selectedProfile.shareableContact,
                          selectedProfile.displayName
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                      Unlock direct phone number & WhatsApp contact for <strong>{selectedProfile.displayName}</strong>.
                    </p>
                    <button
                      onClick={() => {
                        const target = selectedProfile;
                        setSelectedProfile(null);
                        handleUnlockClick(target);
                      }}
                      className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-glow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Unlock Contact Details (₹{selectedProfile.unlockPrice || 399} • Razorpay / UPI)</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}

      {/* Razorpay Payment Modal */}
      <PaymentModal
        isOpen={paymentData.isOpen}
        onClose={() => setPaymentData({ isOpen: false })}
        type="contact_unlock"
        targetProfileId={paymentData.targetProfileId}
        targetProfileName={paymentData.targetProfileName}
        amount={paymentData.amount || 399}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}
