/**
 * 🌸 GIRLS PROFILES & CONTACT DETAILS CONFIGURATION 🌸
 * Frontend configuration mirror for 11 Tamil Nadu Girls Profiles
 */

export interface GirlProfileConfig {
  username: string;
  displayName: string;
  age: number;
  city: string;
  state: string;
  bio: string;
  occupation: string;
  education: string;
  languages: string[];
  interests: string[];
  avatarUrl: string;
  shareableContact: string;
  photos?: Array<{ url: string; isPrimary?: boolean }>;
}

export const GIRLS_PROFILES_LIST: GirlProfileConfig[] = [
  // 1. Priya (Chennai)
  {
    username: 'priya_21',
    displayName: 'Priya',
    age: 21,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Coffee, books, travel and meaningful conversations. Looking forward to meeting pleasant people! ✨',
    occupation: 'UI Designer',
    education: 'B.Des',
    languages: ['English', 'Tamil'],
    interests: ['Travel', 'Music', 'Books', 'Food', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543211',
  },

  // 2. Ananya (Coimbatore)
  {
    username: 'ananya_23',
    displayName: 'Ananya',
    age: 23,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    bio: 'Lover of sunsets, indie music, and weekend drives in Western Ghats. Positive vibes only! 🌅',
    occupation: 'Software Engineer',
    education: 'B.Tech IT',
    languages: ['English', 'Tamil'],
    interests: ['Sunsets', 'Road Trips', 'Music', 'Nature'],
    avatarUrl: '/images/girl2_sari_sun.jpg',
    shareableContact: '9876543212',
  },

  // 3. Sneha (Madurai)
  {
    username: 'sneha_24',
    displayName: 'Sneha',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    bio: 'Madurai girl with a cheerful smile, fashion lover, and weekend cafe explorer. Love genuine talks! 🤍',
    occupation: 'Digital Marketer',
    education: 'B.Sc Visual Com',
    languages: ['English', 'Tamil'],
    interests: ['Fashion', 'Photography', 'Food', 'Cafes'],
    avatarUrl: 'https://images.unsplash.com/photo-1646539741099-7ac3cc927e54?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543213',
  },

  // 4. Kavya (Tiruchirappalli)
  {
    username: 'kavya_22',
    displayName: 'Kavya',
    age: 22,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    bio: 'Classical saree lover, fond of traditional temple architecture and artistic photography. 🪷',
    occupation: 'Architect',
    education: 'B.Arch',
    languages: ['English', 'Tamil'],
    interests: ['Architecture', 'Photography', 'Heritage', 'Reading'],
    avatarUrl: 'https://images.unsplash.com/photo-1729101146492-006e4d9c82f4?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543214',
  },

  // 5. Divya (Salem)
  {
    username: 'divya_25',
    displayName: 'Divya',
    age: 25,
    city: 'Salem',
    state: 'Tamil Nadu',
    bio: 'Bold & independent. Love fitness, mountain trekking, and warm evening coffee. ❤️',
    occupation: 'HR Executive',
    education: 'MBA HR',
    languages: ['English', 'Tamil'],
    interests: ['Fitness', 'Trekking', 'Coffee', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967795457-d6ace6343c59?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543215',
  },

  // 6. Meenakshi (Thanjavur)
  {
    username: 'meenakshi_28',
    displayName: 'Meenakshi',
    age: 28,
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    bio: 'Rooted in Tamil tradition, Carnatic music enthusiast, and classical Tanjore art connoisseur. 🌸',
    occupation: 'Classical Music Teacher',
    education: 'M.A Music',
    languages: ['English', 'Tamil'],
    interests: ['Carnatic Music', 'Art', 'Culture', 'Temples'],
    avatarUrl: '/images/girl6_south_indian.jpg',
    shareableContact: '9876543216',
  },

  // 7. Rithika (Tirunelveli)
  {
    username: 'rithika_23',
    displayName: 'Rithika',
    age: 23,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    bio: 'Curly hair, chic sunglasses, and adventurous road trips. Sweet like Tirunelveli Halwa! 🕶️',
    occupation: 'Graphic Designer',
    education: 'B.Des Multimedia',
    languages: ['English', 'Tamil'],
    interests: ['Design', 'Road Trips', 'Movies', 'Fashion'],
    avatarUrl: 'https://images.unsplash.com/photo-1784360432673-ad3f7727ef09?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543217',
  },

  // 8. Shalini (Erode)
  {
    username: 'shalini_26',
    displayName: 'Shalini',
    age: 26,
    city: 'Erode',
    state: 'Tamil Nadu',
    bio: 'Nature lover, passionate about eco-friendly living and peaceful greenery. Looking for true friendship. 🌿',
    occupation: 'Botanist / Researcher',
    education: 'M.Sc Botany',
    languages: ['English', 'Tamil'],
    interests: ['Nature', 'Gardening', 'Environment', 'Peace'],
    avatarUrl: 'https://images.unsplash.com/photo-1759854881836-53a85959f628?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543218',
  },

  // 9. Nithya (Vellore)
  {
    username: 'nithya_27',
    displayName: 'Nithya',
    age: 27,
    city: 'Vellore',
    state: 'Tamil Nadu',
    bio: 'Smart casual vibes, modern outlook, loves reading novels and long chats with thoughtful minds. 📖',
    occupation: 'Financial Analyst',
    education: 'M.Com Finance',
    languages: ['English', 'Tamil'],
    interests: ['Reading', 'Economics', 'Podcasts', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1781551928573-cd7b9b7a433a?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543219',
  },

  // 10. Deepa (Kanyakumari)
  {
    username: 'deepa_29',
    displayName: 'Deepa',
    age: 29,
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    bio: 'Ocean lover, calm and thoughtful. Cherishing sunsets and sunrise at the southern tip of India. 🌊',
    occupation: 'Marine Biologist',
    education: 'M.Sc Marine Biology',
    languages: ['English', 'Tamil', 'Malayalam'],
    interests: ['Ocean', 'Marine Life', 'Sunsets', 'Yoga'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967074923-2b3ebe6171c3?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543220',
  },

  // 11. Revathi (Dindigul)
  {
    username: 'revathi_31',
    displayName: 'Revathi',
    age: 31,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    bio: 'Elegant, kind-hearted, and loves traditional cooking and family gatherings. Looking for meaningful bonds. 🥻',
    occupation: 'College Professor',
    education: 'Ph.D Literature',
    languages: ['English', 'Tamil'],
    interests: ['Literature', 'Cooking', 'Teaching', 'Poetry'],
    avatarUrl: 'https://images.unsplash.com/photo-1735331467260-0153c5fbd31d?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543221',
  },
];
