/**
 * ============================================================================
 * 🌸 GIRLS PROFILES & CONTACT DETAILS CONFIGURATION 🌸
 * ============================================================================
 * 
 * 📌 TAMIL / TANGLISH GUIDE:
 * Intha file-la neenga girls images, WhatsApp/phone numbers, details-ah
 * direct-ah change pannikkalam or new girls add pannikkalam.
 * 
 * 1. Image URL (avatarUrl): Direct image link podunga (Unsplash, Cloudinary, etc.)
 * 2. Contact details (shareableContact): Avanga WhatsApp / Phone number podunga.
 * 3. Unlock Price (unlockPrice): Starting ₹399 muthal ₹999 varai individual girl-ku set pannalam.
 * 4. Display Name (displayName): Girl's name
 * 5. City, Age, Bio, Occupation: Kerala, Tamil Nadu, Bangalore locations.
 * 
 * ============================================================================
 */

export interface GirlProfileConfig {
  /** Unique ID / username tag */
  username: string;
  /** Display Name shown to users */
  displayName: string;
  /** Age of the girl (Must be 18+) */
  age: number;
  /** City */
  city: string;
  /** State */
  state: string;
  /** Profile Bio / About text */
  bio: string;
  /** Occupation */
  occupation: string;
  /** Education */
  education: string;
  /** Languages spoken */
  languages: string[];
  /** Interest tags */
  interests: string[];
  /** 
   * 🖼️ GIRL PROFILE PHOTO URL
   * Unsplash direct CDN image
   */
  avatarUrl: string;
  /** 
   * 📱 CONTACT / WHATSAPP NUMBER
   * Revealed when user pays unlock fee to unlock contact!
   */
  shareableContact: string;
  /** 
   * 💰 UNLOCK PRICE (₹399, ₹499, ₹599, ₹699, ₹799, ₹899, ₹999)
   */
  unlockPrice: number;
  /** Additional photo gallery (optional) */
  photos?: Array<{ url: string; isPrimary?: boolean }>;
}

export const GIRLS_PROFILES_LIST: GirlProfileConfig[] = [
  // ==========================================================================
  // PROFILE 1: PRIYA (Chennai, Tamil Nadu) - Lush Green Bush
  // ==========================================================================
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
  },

  // ==========================================================================
  // PROFILE 2: ANANYA (Bangalore, Karnataka) - Black Dress Posing
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 3: DR. MEERA (Kochi, Kerala) - Red & Black Clothing
  // ==========================================================================
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
    avatarUrl: 'https://images.unsplash.com/photo-1761125135357-99cbe52a6271?auto=format&fit=crop&w=800&q=80',
    shareableContact: '9876543213',
    unlockPrice: 499,
  },

  // ==========================================================================
  // PROFILE 4: SNEHA (Coimbatore, Tamil Nadu) - Purple Top Fence
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 5: KAVYA (Bangalore, Karnataka) - Black & White Saree
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 6: REVATHI (Madurai, Tamil Nadu) - Temple Portrait
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 7: APARNA (Trivandrum, Kerala) - Red & Black Dress Tree
  // ==========================================================================
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
    unlockPrice: 399,
  },

  // ==========================================================================
  // PROFILE 8: RITHIKA (Chennai, Tamil Nadu) - Red Sari Front of Door (Hot Fashion Stylist)
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 9: DEVIKA (Alleppey, Kerala) - Saree Sits on Boat
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 10: DIVYA (Bangalore, Karnataka) - Green & Brown Talking on Phone
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 11: MALAVIKA (Kozhikode, Kerala) - Smiling for Camera
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 12: SHALINI (Tiruchirappalli, Tamil Nadu) - Long Hair Portrait
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 13: KEERTHANA (Bangalore, Karnataka) - Cosplay / Bunny Costume (Hot Glamorous)
  // ==========================================================================
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

  // ==========================================================================
  // PROFILE 14: SOPHIA (Los Angeles, California, USA) - Tank Top & Curly Hair
  // ==========================================================================
  {
    username: 'sophia_usa',
    displayName: 'Sophia',
    age: 24,
    city: 'Los Angeles',
    state: 'California, USA',
    bio: 'California sunshine, beach jogs in Malibu, high fashion shoots & cozy rooftop dining. Looking for exciting connections! 🌴',
    occupation: 'Fashion Model & Creator',
    education: 'B.A Fashion & Arts, UCLA',
    languages: ['English', 'Spanish'],
    interests: ['Modelling', 'Beaches', 'Pilates', 'Wine Tasting'],
    avatarUrl: 'https://plus.unsplash.com/premium_photo-1690587673708-d6ba8a1579a5?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+13105550142',
    unlockPrice: 1999,
  },

  // ==========================================================================
  // PROFILE 15: JESSICA (Miami, Florida, USA) - Glamour Bikini Set (Super Hot VIP)
  // ==========================================================================
  {
    username: 'jessica_usa',
    displayName: 'Jessica',
    age: 25,
    city: 'Miami',
    state: 'Florida, USA',
    bio: 'South Beach glam, VIP yacht parties, luxury fitness and evening sunsets. Only genuine connections. 🏖️',
    occupation: 'VIP Fitness Model & Influencer',
    education: 'B.S Sports Science, UM',
    languages: ['English'],
    interests: ['Yacht Parties', 'Fitness', 'Travel', 'Luxury'],
    avatarUrl: 'https://images.unsplash.com/photo-1582639590011-f5a8416d1101?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+13055550189',
    unlockPrice: 2999,
  },

  // ==========================================================================
  // PROFILE 16: CHLOE (Vancouver, British Columbia, Canada) - Green Bikini Sunbathing
  // ==========================================================================
  {
    username: 'chloe_canada',
    displayName: 'Chloe',
    age: 23,
    city: 'Vancouver',
    state: 'British Columbia, Canada',
    bio: 'Pacific ocean breezes, mountain skiing in Whistler, summer sunbathing and travel vlogging! 🌊',
    occupation: 'Travel Vlogger & Model',
    education: 'B.Com Marketing, UBC',
    languages: ['English', 'French'],
    interests: ['Travel', 'Skiing', 'Sunbathing', 'Nature'],
    avatarUrl: 'https://images.unsplash.com/photo-1531469535976-c6fc3604014f?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+16045550177',
    unlockPrice: 2499,
  },

  // ==========================================================================
  // PROFILE 17: EMMA (Toronto, Ontario, Canada) - Tattoo Artist & Sitting
  // ==========================================================================
  {
    username: 'emma_canada',
    displayName: 'Emma',
    age: 26,
    city: 'Toronto',
    state: 'Ontario, Canada',
    bio: 'Creative rebel, custom tattoo artist, art gallery exhibitions and indie music shows. Love real conversations. 🖤',
    occupation: 'Tattoo Artist & Creative Director',
    education: 'B.F.A Visual Arts, OCAD',
    languages: ['English'],
    interests: ['Tattoos', 'Art', 'Indie Rock', 'Coffee'],
    avatarUrl: 'https://images.unsplash.com/photo-1589881787083-0fcfec1db918?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+14165550134',
    unlockPrice: 1999,
  },

  // ==========================================================================
  // PROFILE 18: JI-WOO (Seoul, South Korea) - Crystal Water Bikini (Hot Korean Glam)
  // ==========================================================================
  {
    username: 'jiwoo_korea',
    displayName: 'Ji-woo',
    age: 23,
    city: 'Seoul',
    state: 'Gangnam, South Korea',
    bio: 'Gangnam aesthetic, K-beauty ambassador, crystal water resorts and trendy cafes in Hongdae. Annyeong! ✨',
    occupation: 'K-Beauty Influencer & Model',
    education: 'Media & Design, Yonsei Univ',
    languages: ['Korean', 'English'],
    interests: ['K-Beauty', 'Fashion', 'Resorts', 'Photography'],
    avatarUrl: 'https://images.unsplash.com/photo-1754751477999-821708330f79?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+821055550198',
    unlockPrice: 2999,
  },

  // ==========================================================================
  // PROFILE 19: MIN-SEO (Busan, South Korea) - White Shirt Bed Aesthetic
  // ==========================================================================
  {
    username: 'minseo_korea',
    displayName: 'Min-seo',
    age: 22,
    city: 'Busan',
    state: 'Haeundae, South Korea',
    bio: 'Haeundae coastal girl, pilates trainer, cozy minimalist bedroom vibes, and night drives along the bridge. 🤍',
    occupation: 'Pilates Trainer & Stylist',
    education: 'B.Sc Health & Physical Ed',
    languages: ['Korean', 'English'],
    interests: ['Pilates', 'Aesthetics', 'Ocean View', 'Music'],
    avatarUrl: 'https://images.unsplash.com/photo-1628336358262-7a8c61ffcd01?auto=format&fit=crop&w=800&q=80',
    shareableContact: '+821055550164',
    unlockPrice: 1999,
  },
];
