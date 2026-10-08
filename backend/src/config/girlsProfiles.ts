/**
 * ============================================================================
 * 🌸 COMPLETE GIRLS PROFILES & CONTACT DETAILS CONFIGURATION 🌸
 * ============================================================================
 * 
 * Contains ALL verified Indian girl profiles:
 * 1. All original Unsplash photo profiles (Chennai, Coimbatore, Bangalore, Kochi, Madurai, etc.)
 * 2. All 12 downloaded Tamil Nadu profiles (girl_14.jpg to girl_25.jpg)
 * 3. ZERO foreign/other country profiles
 * 4. Direct WhatsApp / Phone contacts (revealed ONLY upon verified payment)
 * ============================================================================
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
  unlockPrice: number;
  userTag?: string;
  photos?: Array<{ url: string; isPrimary?: boolean }>;
}

export const GIRLS_PROFILES_LIST: GirlProfileConfig[] = [
  // ─── CUSTOM 1: ABIRAMI (Madurai, Tamil Nadu) - ₹399 - New User ───
  {
    username: 'abirami_23',
    displayName: 'Abirami',
    age: 23,
    city: 'Madurai',
    state: 'Tamil Nadu',
    bio: 'Simple traditional girl with a warm heart. Loves evening walks, sweet talks, and genuine friendships. 🌸',
    occupation: 'B.Sc Graduate',
    education: 'B.Sc Mathematics',
    languages: ['Tamil', 'English'],
    interests: ['Music', 'Long Walks', 'Cooking', 'Temple Visits'],
    avatarUrl: '/profiles/custom_girl_1.jpg',
    shareableContact: '9840123451',
    unlockPrice: 399,
    userTag: 'New User',
  },

  // ─── CUSTOM 2: DHARSHINI (Chennai, Tamil Nadu) - ₹399 - Old User ───
  {
    username: 'dharshini_24',
    displayName: 'Dharshini',
    age: 24,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Dusky beauty, passionate HR professional, filter coffee enthusiast, seeking sincere connections. ☕',
    occupation: 'HR Recruiter',
    education: 'MBA HR',
    languages: ['Tamil', 'English'],
    interests: ['Coffee', 'Travel', 'Reading', 'Soulful Music'],
    avatarUrl: '/profiles/custom_girl_2.jpg',
    shareableContact: '9840123452',
    unlockPrice: 399,
    userTag: 'Old User',
  },

  // ─── CUSTOM 3: PRIYADHARSHINI (Salem, Tamil Nadu) - ₹399 - New User ───
  {
    username: 'priyadharshini_22',
    displayName: 'Priyadharshini',
    age: 22,
    city: 'Salem',
    state: 'Tamil Nadu',
    bio: 'Down-to-earth, sweet smile and cheerful personality. Looking for a caring and honest friendship. ✨',
    occupation: 'Accounts Executive',
    education: 'B.Com',
    languages: ['Tamil', 'English'],
    interests: ['Movies', 'Foodie', 'Music', 'Photography'],
    avatarUrl: '/profiles/custom_girl_3.jpg',
    shareableContact: '9840123453',
    unlockPrice: 399,
    userTag: 'New User',
  },

  // ─── CUSTOM 4: SARANYA (Coimbatore, Tamil Nadu) - ₹399 - Old User ───
  {
    username: 'saranya_24',
    displayName: 'Saranya',
    age: 24,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    bio: 'Calm mind, bright smile! College lecturer who loves nature vibes, traditional values, and deep chats. 🌿',
    occupation: 'College Lecturer',
    education: 'M.Sc Physics',
    languages: ['Tamil', 'English'],
    interests: ['Teaching', 'Nature', 'Books', 'Western Ghats'],
    avatarUrl: '/profiles/custom_girl_4.jpg',
    shareableContact: '9840123454',
    unlockPrice: 399,
    userTag: 'Old User',
  },

  // ─── CUSTOM 5: GAYATHRI (Trichy, Tamil Nadu) - ₹399 - New User ───
  {
    username: 'gayathri_24',
    displayName: 'Gayathri',
    age: 24,
    city: 'Trichy',
    state: 'Tamil Nadu',
    bio: 'Software engineer by weekday, classical saree lover on weekends. Kind soul who values loyalty. ❤️',
    occupation: 'Software Engineer',
    education: 'B.Tech IT',
    languages: ['Tamil', 'English'],
    interests: ['Coding', 'Sarees', 'Acoustics', 'Weekend Drives'],
    avatarUrl: '/profiles/custom_girl_5.jpg',
    shareableContact: '9840123455',
    unlockPrice: 399,
    userTag: 'New User',
  },

  // ─── CUSTOM 6: ARCHANA (Tirunelveli, Tamil Nadu) - ₹399 - Old User ───
  {
    username: 'archana_25',
    displayName: 'Archana',
    age: 25,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    bio: 'Expressive eyes, sweet heart, graphic designer with an eye for aesthetics and soulful conversations. 🌸',
    occupation: 'Graphic Designer',
    education: 'B.Sc Visual Communication',
    languages: ['Tamil', 'English'],
    interests: ['Design', 'Art', 'Melodies', 'Sunsets'],
    avatarUrl: '/profiles/custom_girl_6.jpg',
    shareableContact: '9840123456',
    unlockPrice: 399,
    userTag: 'Old User',
  },

  // ─── CUSTOM 7: DEEPA (Erode, Tamil Nadu) - ₹399 - New User ───
  {
    username: 'deepa_25',
    displayName: 'Deepa',
    age: 25,
    city: 'Erode',
    state: 'Tamil Nadu',
    bio: 'High school teacher with a calm & gentle demeanor. Simple lifestyle, handloom lover, looking for meaningful talks. 🪷',
    occupation: 'High School Teacher',
    education: 'B.Ed Literature',
    languages: ['Tamil', 'English'],
    interests: ['Literature', 'Teaching', 'Handloom', 'Cooking'],
    avatarUrl: '/profiles/custom_girl_7.jpg',
    shareableContact: '9840123457',
    unlockPrice: 399,
    userTag: 'New User',
  },

  // ─── 1. PRIYA (Chennai) ───
  {
    username: 'priya_22',
    displayName: 'Priya',
    age: 22,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Greenery lover, nature walks, warm smiles, and meaningful conversations. Looking to connect with kind souls! 🌿',
    occupation: 'Software Engineer',
    education: 'B.Tech CSE',
    languages: ['English', 'Tamil'],
    interests: ['Nature', 'Music', 'Coffee', 'Travel'],
    avatarUrl: 'https://images.unsplash.com/photo-1689580298851-d4482a124290?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543211',
    unlockPrice: 399,
    userTag: 'Old User',
  },

  // ─── 2. ANANYA (Bangalore) ───
  {
    username: 'ananya_24',
    displayName: 'Ananya',
    age: 24,
    city: 'Bangalore',
    state: 'Karnataka',
    bio: 'Indiranagar explorer, product designer by day, indie gig & cafe hopper on weekends. Let’s connect! ☕',
    occupation: 'UI/UX Designer',
    education: 'B.Des',
    languages: ['English', 'Kannada', 'Tamil', 'Hindi'],
    interests: ['Design', 'Cafes', 'Indie Music', 'Art'],
    avatarUrl: 'https://images.unsplash.com/photo-1710972197951-3aade7376076?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543212',
    unlockPrice: 599,
  },

  // ─── 3. DR. MEERA (Kochi) ───
  {
    username: 'meera_25',
    displayName: 'Dr. Meera',
    age: 25,
    city: 'Kochi',
    state: 'Kerala',
    bio: 'Malayali penne with a cheerful smile! Doctor, Kathakali enthusiast, and coastal sunset admirer. 🌸',
    occupation: 'Dental Surgeon',
    education: 'BDS',
    languages: ['English', 'Malayalam', 'Tamil'],
    interests: ['Classical Dance', 'Medicine', 'Sunsets', 'Travel'],
    avatarUrl: '/profiles/meera.jpg',
    shareableContact: '9876543213',
    unlockPrice: 499,
  },

  // ─── 4. SNEHA (Coimbatore) ───
  {
    username: 'sneha_23',
    displayName: 'Sneha',
    age: 23,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    bio: 'Siruvani breeze lover, weekend road trips across Western Ghats, fond of cozy cafes and laughter! 💜',
    occupation: 'Content Creator',
    education: 'B.A Mass Comm',
    languages: ['English', 'Tamil'],
    interests: ['Road Trips', 'Photography', 'Vlogging', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967795578-81e7669b2185?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543214',
    unlockPrice: 699,
  },

  // ─── 5. KAVYA (Bangalore) ───
  {
    username: 'kavya_26',
    displayName: 'Kavya',
    age: 26,
    city: 'Bangalore',
    state: 'Karnataka',
    bio: 'Koramangala girl, startup marketer, loves handloom sarees, books, and rooftop acoustics. 🪷',
    occupation: 'Growth Marketer',
    education: 'MBA',
    languages: ['English', 'Kannada', 'Tamil'],
    interests: ['Startups', 'Sarees', 'Literature', 'Acoustic'],
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1691030255899-cccde3a4e04f?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543215',
    unlockPrice: 799,
  },

  // ─── 6. REVATHI (Madurai) ───
  {
    username: 'revathi_25',
    displayName: 'Revathi',
    age: 25,
    city: 'Madurai',
    state: 'Tamil Nadu',
    bio: 'Traditional soul with a modern heartbeat. Bharatanatyam artist, Madurai Meenakshi temple devotee. ✨',
    occupation: 'Dance Instructor',
    education: 'M.F.A Classical Dance',
    languages: ['English', 'Tamil'],
    interests: ['Bharatanatyam', 'Heritage', 'Temple Art', 'Poetry'],
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1726873351723-cb980a1d6dcb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543216',
    unlockPrice: 499,
  },

  // ─── 7. APARNA (Trivandrum) ───
  {
    username: 'aparna_24',
    displayName: 'Aparna',
    age: 24,
    city: 'Trivandrum',
    state: 'Kerala',
    bio: 'Nature lover from Kerala’s capital. Passionate about literature, beach strolls at Kovalam & true vibes. 🌿',
    occupation: 'High School Educator',
    education: 'M.A English',
    languages: ['English', 'Malayalam'],
    interests: ['Teaching', 'Beaches', 'Novels', 'Planting'],
    avatarUrl: 'https://images.unsplash.com/photo-1710967074857-d5c6d53d926b?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543217',
    unlockPrice: 499,
  },

  // ─── 8. RITHIKA (Chennai) ───
  {
    username: 'rithika_23',
    displayName: 'Rithika',
    age: 23,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Besant Nagar beach sunset lover, fashion stylist, and vintage aesthetic collector. Let’s talk! ❤️',
    occupation: 'Fashion Stylist',
    education: 'B.Des Fashion',
    languages: ['English', 'Tamil'],
    interests: ['Fashion', 'Photography', 'Cafes', 'Beaches'],
    avatarUrl: 'https://images.unsplash.com/photo-1738853941039-b3d49beb16aa?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543218',
    unlockPrice: 899,
  },

  // ─── 9. DEVIKA (Alleppey) ───
  {
    username: 'devika_26',
    displayName: 'Devika',
    age: 26,
    city: 'Alleppey',
    state: 'Kerala',
    bio: 'Backwaters, tranquil houseboats, Ayurveda practitioner and lover of peaceful melodies. 🚣‍♀️',
    occupation: 'Ayurvedic Doctor',
    education: 'BAMS',
    languages: ['English', 'Malayalam'],
    interests: ['Wellness', 'Houseboats', 'Nature', 'Meditation'],
    avatarUrl: 'https://images.unsplash.com/photo-1747993114347-7a4a9d454e22?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543219',
    unlockPrice: 599,
  },

  // ─── 10. DIVYA (Bangalore) ───
  {
    username: 'divya_27',
    displayName: 'Divya',
    age: 27,
    city: 'Bangalore',
    state: 'Karnataka',
    bio: 'Tech park busy bee in Whitefield! Loves fitness, weekend getaways to Nandi Hills, and hearty laughs. 📱',
    occupation: 'Senior HR Specialist',
    education: 'MBA HR',
    languages: ['English', 'Kannada', 'Tamil', 'Telugu'],
    interests: ['Fitness', 'Trekking', 'Podcasts', 'Networking'],
    avatarUrl: 'https://images.unsplash.com/photo-1641877953739-8cab85119201?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543220',
    unlockPrice: 699,
  },

  // ─── 11. MALAVIKA (Kozhikode) ───
  {
    username: 'malavika_22',
    displayName: 'Malavika',
    age: 22,
    city: 'Kozhikode',
    state: 'Kerala',
    bio: 'Malabar biryani enthusiast, architecture student, loves sketching old town buildings and rainy days. ☕',
    occupation: 'Architectural Intern',
    education: 'B.Arch',
    languages: ['English', 'Malayalam'],
    interests: ['Sketching', 'Rain', 'Architecture', 'Foodie'],
    avatarUrl: 'https://images.unsplash.com/photo-1669829508691-8ce630261b7b?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543221',
    unlockPrice: 499,
  },

  // ─── 12. SHALINI (Tiruchirappalli) ───
  {
    username: 'shalini_24',
    displayName: 'Shalini',
    age: 24,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    bio: 'Rockfort city girl with a vibrant outlook. Numbers lover by profession, watercolor artist at heart. 🎨',
    occupation: 'Financial Analyst',
    education: 'M.Com',
    languages: ['English', 'Tamil'],
    interests: ['Painting', 'Economics', 'Badminton', 'Movies'],
    avatarUrl: 'https://images.unsplash.com/photo-1669829586323-0aa141a664cc?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543222',
    unlockPrice: 599,
  },

  // ─── 13. KEERTHANA (Bangalore) ───
  {
    username: 'keerthana_23',
    displayName: 'Keerthana',
    age: 23,
    city: 'Bangalore',
    state: 'Karnataka',
    bio: 'HSR Layout girl! Anime, comic-con, creative design, and late night cold coffees. Hit me up! 🖤',
    occupation: 'Motion & Visual Designer',
    education: 'B.Sc Animation',
    languages: ['English', 'Kannada', 'Tamil'],
    interests: ['Anime', 'Cosplay', 'Gaming', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1788022164447-c491541fe0a0?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543223',
    unlockPrice: 999,
  },

  // ─── 14. PRIYA (Classic Unsplash) ───
  {
    username: 'priya_classic',
    displayName: 'Priya S.',
    age: 21,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Coffee, books, travel and meaningful conversations. Looking forward to meeting pleasant people! ✨',
    occupation: 'UI Designer',
    education: 'B.Des',
    languages: ['English', 'Tamil'],
    interests: ['Travel', 'Music', 'Books', 'Food', 'Design'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543227',
    unlockPrice: 499,
  },

  // ─── 15. SNEHA (Classic Unsplash) ───
  {
    username: 'sneha_classic',
    displayName: 'Sneha M.',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    bio: 'Madurai girl with a cheerful smile, fashion lover, and weekend cafe explorer. Love genuine talks! 🤍',
    occupation: 'Digital Marketer',
    education: 'B.Sc Visual Com',
    languages: ['English', 'Tamil'],
    interests: ['Fashion', 'Photography', 'Food', 'Cafes'],
    avatarUrl: 'https://images.unsplash.com/photo-1646539741099-7ac3cc927e54?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543228',
    unlockPrice: 499,
  },

  // ─── 16. KAVYA (Classic Unsplash) ───
  {
    username: 'kavya_classic',
    displayName: 'Kavya T.',
    age: 22,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    bio: 'Classical saree lover, fond of traditional temple architecture and artistic photography. 🪷',
    occupation: 'Architect',
    education: 'B.Arch',
    languages: ['English', 'Tamil'],
    interests: ['Architecture', 'Photography', 'Heritage', 'Reading'],
    avatarUrl: 'https://images.unsplash.com/photo-1729101146492-006e4d9c82f4?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543229',
    unlockPrice: 599,
  },

  // ─── 17. RITHIKA (Classic Unsplash) ───
  {
    username: 'rithika_classic',
    displayName: 'Rithika V.',
    age: 23,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    bio: 'Curly hair, chic sunglasses, and adventurous road trips. Sweet like Tirunelveli Halwa! 🕶️',
    occupation: 'Graphic Designer',
    education: 'B.Des Multimedia',
    languages: ['English', 'Tamil'],
    interests: ['Design', 'Road Trips', 'Movies', 'Fashion'],
    avatarUrl: 'https://images.unsplash.com/photo-1784360432673-ad3f7727ef09?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543230',
    unlockPrice: 699,
  },

  // ─── 18. SHALINI (Classic Unsplash) ───
  {
    username: 'shalini_classic',
    displayName: 'Shalini E.',
    age: 26,
    city: 'Erode',
    state: 'Tamil Nadu',
    bio: 'Nature lover, passionate about eco-friendly living and peaceful greenery. Looking for true friendship. 🌿',
    occupation: 'Botanist / Researcher',
    education: 'M.Sc Botany',
    languages: ['English', 'Tamil'],
    interests: ['Nature', 'Gardening', 'Environment', 'Peace'],
    avatarUrl: 'https://images.unsplash.com/photo-1759854881836-53a85959f628?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543231',
    unlockPrice: 499,
  },

  // ─── 19. NITHYA (Vellore Unsplash) ───
  {
    username: 'nithya_classic',
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
    shareableContact: '9876543232',
    unlockPrice: 599,
  },

  // ─── 20. DEEPA (Kanyakumari Unsplash) ───
  {
    username: 'deepa_classic',
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
    shareableContact: '9876543233',
    unlockPrice: 499,
  },

  // ─── 21. REVATHI (Dindigul Unsplash) ───
  {
    username: 'revathi_classic',
    displayName: 'Revathi D.',
    age: 31,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    bio: 'Elegant, kind-hearted, and loves traditional cooking and family gatherings. Looking for meaningful bonds. 🥻',
    occupation: 'College Professor',
    education: 'Ph.D Literature',
    languages: ['English', 'Tamil'],
    interests: ['Literature', 'Cooking', 'Teaching', 'Poetry'],
    avatarUrl: 'https://images.unsplash.com/photo-1735331467260-0153c5fbd31d?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543234',
    unlockPrice: 499,
  },

  // ─── 22. POOJA (Chennai Unsplash) ───
  {
    username: 'pooja_classic',
    displayName: 'Pooja',
    age: 23,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Marina beach evening walks, fashion designer, food enthusiast and cheerful companion! 🌸',
    occupation: 'Fashion Designer',
    education: 'B.Des',
    languages: ['English', 'Tamil', 'Hindi'],
    interests: ['Fashion', 'Foodie', 'Beaches', 'Music'],
    avatarUrl: '/profiles/pooja.jpg',
    shareableContact: '9876543249',
    unlockPrice: 599,
  },


  // ─── 25. NANDHINI (Salem - Verified Local Image) ───
  {
    username: 'nandhini_23',
    displayName: 'Nandhini',
    age: 23,
    city: 'Salem',
    state: 'Tamil Nadu',
    bio: 'Simple, sweet and nature enthusiast from Salem. Loves photography, warm coffee, and genuine conversations. 🌸',
    occupation: 'Graphic Artist',
    education: 'B.Sc Visual Communication',
    languages: ['Tamil', 'English'],
    interests: ['Photography', 'Music', 'Nature', 'Travel'],
    avatarUrl: '/profiles/girl_14.jpg',
    shareableContact: '9876543224',
    unlockPrice: 499,
  },

  // ─── 26. KEERTHI (Madurai - Verified Local Image) ───
  {
    username: 'keerthi_24',
    displayName: 'Keerthi',
    age: 24,
    city: 'Madurai',
    state: 'Tamil Nadu',
    bio: 'Cheerful college graduate, traditional yet modern. Loves classical dance, jasmine flowers, and genuine chats. ✨',
    occupation: 'Content Writer',
    education: 'M.A English',
    languages: ['Tamil', 'English'],
    interests: ['Writing', 'Dance', 'Books', 'Cafes'],
    avatarUrl: '/profiles/keerthi.jpg',
    shareableContact: '9876543225',
    unlockPrice: 599,
  },

  // ─── 27. DEEPIKA (Tirunelveli - Verified Local Image) ───
  {
    username: 'deepika_22',
    displayName: 'Deepika',
    age: 22,
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    bio: 'Sweet smile and adventurous heart. Loves evening river walks, road trips, and good company. ❤️',
    occupation: 'Junior Accountant',
    education: 'B.Com',
    languages: ['Tamil', 'English'],
    interests: ['Travel', 'Foodie', 'Road Trips', 'Music'],
    avatarUrl: '/profiles/girl_16.jpg',
    shareableContact: '9876543226',
    unlockPrice: 499,
  },

  // ─── 28. SWETHA (Chennai - Verified Local Image) ───
  {
    username: 'swetha_25',
    displayName: 'Swetha',
    age: 25,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Corporate analyst in OMR by day, fashion & lifestyle enthusiast by evening. Looking for true connections! 👠',
    occupation: 'Business Analyst',
    education: 'MBA',
    languages: ['Tamil', 'English', 'Telugu'],
    interests: ['Fashion', 'Beaches', 'Fitness', 'Fine Dining'],
    avatarUrl: '/profiles/girl_17.jpg',
    shareableContact: '9876543238',
    unlockPrice: 699,
  },

  // ─── 29. PAVITHRA (Erode - Verified Local Image) ───
  {
    username: 'pavithra_23',
    displayName: 'Pavithra',
    age: 23,
    city: 'Erode',
    state: 'Tamil Nadu',
    bio: 'Textile designer from Erode. Loves creative art, handloom weaves, and peaceful garden walks. 🌿',
    occupation: 'Fashion & Textile Designer',
    education: 'B.Des Fashion',
    languages: ['Tamil', 'English'],
    interests: ['Art', 'Design', 'Gardening', 'Movies'],
    avatarUrl: '/profiles/girl_18.jpg',
    shareableContact: '9876543239',
    unlockPrice: 499,
  },

  // ─── 30. SOUNDARYA (Thanjavur - Verified Local Image) ───
  {
    username: 'soundarya_24',
    displayName: 'Soundarya',
    age: 24,
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    bio: 'Traditional South Indian beauty, passionate about Carnatic music, heritage temples, and soulful chats. 🥻',
    occupation: 'Music Teacher',
    education: 'M.A Music',
    languages: ['Tamil', 'English'],
    interests: ['Music', 'Heritage', 'Temples', 'Cooking'],
    avatarUrl: '/profiles/girl_19.jpg',
    shareableContact: '9876543240',
    unlockPrice: 599,
  },

  // ─── 31. NIVETHA (Coimbatore - Verified Local Image) ───
  {
    username: 'nivetha_26',
    displayName: 'Nivetha',
    age: 26,
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    bio: 'Techie at Tidel Park Coimbatore. Siruvani lover, fitness regular, fond of late night bike rides. 🏍️',
    occupation: 'Software Engineer',
    education: 'B.E CSE',
    languages: ['Tamil', 'English'],
    interests: ['Fitness', 'Bike Rides', 'Tech', 'Coffee'],
    avatarUrl: '/profiles/girl_20.jpg',
    shareableContact: '9876543241',
    unlockPrice: 599,
  },

  // ─── 32. HARINI (Tiruchirappalli - Verified Local Image) ───
  {
    username: 'harini_22',
    displayName: 'Harini',
    age: 22,
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    bio: 'Final year college student. Fun, cheerful, and loves painting landscapes and listening to Anirudh songs! 🎨',
    occupation: 'Student / Freelancer',
    education: 'B.Sc Visual Com',
    languages: ['Tamil', 'English'],
    interests: ['Painting', 'Music', 'Photography', 'Friends'],
    avatarUrl: '/profiles/girl_21.jpg',
    shareableContact: '9876543242',
    unlockPrice: 499,
  },

  // ─── 33. ABIRAMI (Vellore - Verified Local Image) ───
  {
    username: 'abirami_24',
    displayName: 'Abirami',
    age: 24,
    city: 'Vellore',
    state: 'Tamil Nadu',
    bio: 'Healthcare professional from Vellore. Dedicated, warm-hearted, and loves weekend badminton matches. 🏸',
    occupation: 'Pharmacist',
    education: 'B.Pharm',
    languages: ['Tamil', 'English'],
    interests: ['Badminton', 'Health', 'Travel', 'Cinema'],
    avatarUrl: '/profiles/girl_22.jpg',
    shareableContact: '9876543243',
    unlockPrice: 499,
  },

  // ─── 34. GAYATHRI (Dindigul - Verified Local Image) ───
  {
    username: 'gayathri_25',
    displayName: 'Gayathri',
    age: 25,
    city: 'Dindigul',
    state: 'Tamil Nadu',
    bio: 'Foodie at heart, loves Dindigul biryani, evening mountain drives to Kodaikanal, and hearty humor. 🍛',
    occupation: 'Teacher',
    education: 'B.Ed',
    languages: ['Tamil', 'English'],
    interests: ['Foodie', 'Trekking', 'Teaching', 'Movies'],
    avatarUrl: '/profiles/girl_23.jpg',
    shareableContact: '9876543244',
    unlockPrice: 499,
  },

  // ─── 35. SANDHIYA (Kanyakumari - Verified Local Image) ───
  {
    username: 'sandhiya_23',
    displayName: 'Sandhiya',
    age: 23,
    city: 'Kanyakumari',
    state: 'Tamil Nadu',
    bio: 'Coastal breeze and ocean sunrise lover. Looking for genuine adult friendship and honest connection. 🌊',
    occupation: 'Digital Content Creator',
    education: 'B.A English',
    languages: ['Tamil', 'Malayalam', 'English'],
    interests: ['Ocean', 'Vlogging', 'Sunsets', 'Music'],
    avatarUrl: '/profiles/girl_24.jpg',
    shareableContact: '9876543245',
    unlockPrice: 499,
  },

  // ─── 36. MYTHILI (Kanchipuram - Verified Local Image) ───
  {
    username: 'mythili_24',
    displayName: 'Mythili',
    age: 24,
    city: 'Kanchipuram',
    state: 'Tamil Nadu',
    bio: 'Silk city girl! Traditional values with progressive mindset. Loves reading historical novels and photography. 🥻',
    occupation: 'Research Associate',
    education: 'M.Sc',
    languages: ['Tamil', 'English'],
    interests: ['History', 'Photography', 'Handlooms', 'Coffee'],
    avatarUrl: '/profiles/girl_25.jpg',
    shareableContact: '9876543246',
    unlockPrice: 499,
  },
];
