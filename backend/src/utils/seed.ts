import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db';
import { ENV } from '../config/env';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { FAQ } from '../models/FAQ';
import { Admin } from '../models/Admin';
import { ContactUnlock } from '../models/ContactUnlock';
import { Payment } from '../models/Payment';
import { GIRLS_PROFILES_LIST } from '../config/girlsProfiles';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Seeding database...');

    // 1. Seed Admin (rahul2005 / Abcd@1234)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);

    let existingAdmin = await Admin.findOne({ username: ENV.ADMIN_USERNAME.toLowerCase() });
    if (!existingAdmin) {
      await Admin.create({
        username: ENV.ADMIN_USERNAME.toLowerCase(),
        password: hashedPassword,
        role: 'superadmin',
      });
      console.log(`[Seed] Admin created: ${ENV.ADMIN_USERNAME}`);
    } else {
      existingAdmin.password = hashedPassword;
      await existingAdmin.save();
      console.log(`[Seed] Admin updated with current credentials: ${ENV.ADMIN_USERNAME}`);
    }

    // 2. Seed FAQs
    const faqsCount = await FAQ.countDocuments();
    if (faqsCount === 0) {
      await FAQ.insertMany([
        {
          question: 'How do I unlock a contact on Frndma?',
          answer:
            'Browse through the verified profiles on the Discover page. When you find someone you want to connect with, click "Unlock Contact". Complete the quick ₹399 Razorpay payment, and their verified phone number and direct WhatsApp button will be revealed immediately.',
          category: 'Contact Unlock',
          order: 1,
          isActive: true,
        },
        {
          question: 'Where can I access my unlocked contacts?',
          answer:
            'All contacts you have unlocked are permanently saved in your "Unlocked Contacts" page in the navigation bar. You can access their phone numbers and WhatsApp links anytime without paying again.',
          category: 'Contact Unlock',
          order: 2,
          isActive: true,
        },
        {
          question: 'Is my exact address ever shown?',
          answer:
            'Never. We only display broad city indicators (e.g., Chennai, Bangalore). Exact home addresses are never collected or shown.',
          category: 'Privacy',
          order: 3,
          isActive: true,
        },
        {
          question: 'How do I reach support if I need assistance?',
          answer:
            `Our official support team is available via email at ${ENV.SUPPORT_EMAIL || 'catman2kai@gmail.com'}.`,
          category: 'Support',
          order: 4,
          isActive: true,
        },
      ]);
      console.log('[Seed] FAQs seeded.');
    }

    // 3. Seed & Sync Verified Female Profiles from girlsProfiles.ts
    const defaultPassword = await bcrypt.hash('Frndma@2026', salt);

    for (const g of GIRLS_PROFILES_LIST) {
      let user = await User.findOne({
        $or: [{ username: g.username }, { mobileNumber: g.shareableContact }],
      });
      if (!user) {
        user = await User.create({
          username: g.username,
          mobileNumber: g.shareableContact || `98765${Math.floor(10000 + Math.random() * 90000)}`,
          password: defaultPassword,
          isAgeConfirmed: true,
          role: 'user',
          isOnline: true,
        });
      }

      await Profile.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          displayName: g.displayName,
          age: g.age,
          gender: 'female',
          city: g.city,
          state: g.state || 'Tamil Nadu',
          bio: g.bio,
          interests: g.interests || ['Music', 'Travel'],
          occupation: g.occupation || 'Professional',
          education: g.education || 'Graduate',
          languages: g.languages || ['English', 'Tamil'],
          avatarUrl: g.avatarUrl,
          photos: [{ url: g.avatarUrl, publicId: `seed_${g.username}`, isPrimary: true }],
          contactSharing: true,
          shareableContact: g.shareableContact,
          unlockPrice: g.unlockPrice || 399,
          isProfileComplete: true,
        },
        { upsert: true, new: true }
      );
    }
    console.log(`[Seed] Synced ${GIRLS_PROFILES_LIST.length} female profiles from config successfully.`);

    // 4. Seed Demo Male User (demo_male / Test@1234) with Unlocked Contact for testing
    const demoPassword = await bcrypt.hash('Test@1234', salt);
    let demoUser = await User.findOne({ username: 'demo_male' });
    if (!demoUser) {
      demoUser = await User.create({
        username: 'demo_male',
        mobileNumber: '9876543200',
        password: demoPassword,
        isAgeConfirmed: true,
        role: 'user',
        isOnline: true,
      });
    } else {
      demoUser.password = demoPassword;
      await demoUser.save();
    }

    await Profile.findOneAndUpdate(
      { userId: demoUser._id },
      {
        userId: demoUser._id,
        displayName: 'Karthik (Demo)',
        age: 24,
        gender: 'male',
        city: 'Chennai',
        state: 'Tamil Nadu',
        bio: 'Tech enthusiast and music lover. Testing Frndma connection & unlock features! 🚀',
        interests: ['Tech', 'Music', 'Travel', 'Fitness'],
        occupation: 'Software Developer',
        languages: ['English', 'Tamil'],
        isProfileComplete: true,
        contactSharing: true,
        shareableContact: '9876543200',
      },
      { upsert: true, new: true }
    );

    // Pre-unlock Priya (priya_21) so the demo account already has 1 unlocked contact
    const priyaUser = await User.findOne({ username: 'priya_21' });
    if (priyaUser) {
      await ContactUnlock.findOneAndUpdate(
        { userId: demoUser._id, profileOwnerId: priyaUser._id },
        {
          userId: demoUser._id,
          profileOwnerId: priyaUser._id,
          paymentId: 'pay_demo_pre_unlocked',
          orderId: 'order_demo_pre_unlocked',
          status: 'unlocked',
          unlockedAt: new Date(),
        },
        { upsert: true, new: true }
      );

      await Payment.findOneAndUpdate(
        { userId: demoUser._id, razorpayOrderId: 'order_demo_pre_unlocked' },
        {
          userId: demoUser._id,
          razorpayOrderId: 'order_demo_pre_unlocked',
          razorpayPaymentId: 'pay_demo_pre_unlocked',
          amount: 399,
          currency: 'INR',
          type: 'contact_unlock',
          targetProfileId: priyaUser._id,
          status: 'captured',
          notes: { demo: true, target: 'Priya' },
        },
        { upsert: true, new: true }
      );
      console.log('[Seed] Demo male user (demo_male / Test@1234) with Priya unlocked ready for testing.');
    }

    console.log('[Seed] Database initialization complete.');
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  });
}
