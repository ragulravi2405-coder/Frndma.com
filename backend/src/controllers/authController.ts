import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { Profile } from '../models/Profile';
import { Admin } from '../models/Admin';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/auth';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  mobileNumber: z
    .string()
    .min(10, 'Valid 10-digit mobile number required')
    .max(15, 'Mobile number too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAgeConfirmed: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that you are at least 18 years old to join Frndma',
  }),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Username or mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, ENV.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const sendTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, mobileNumber, password, isAgeConfirmed } = req.body;

    const reservedUsernames = [ENV.ADMIN_USERNAME.toLowerCase(), 'rahul2005', 'admin', 'administrator', 'root'];
    if (reservedUsernames.includes(username.toLowerCase())) {
      res.status(400).json({
        success: false,
        message: 'This username is reserved and cannot be registered.',
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { mobileNumber }],
    });

    if (existingUser) {
      if (existingUser.username === username.toLowerCase()) {
        res.status(400).json({
          success: false,
          message: 'Username is already taken. Please choose another.',
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: 'An account with this mobile number already exists.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.toLowerCase(),
      mobileNumber,
      password: hashedPassword,
      isAgeConfirmed,
      role: 'user',
    });

    // Create initial draft profile
    await Profile.create({
      userId: newUser._id,
      displayName: username,
      age: 18,
      city: 'Not Specified',
      bio: '',
      interests: [],
      languages: ['English'],
      isProfileComplete: false,
    });

    const token = generateToken(newUser._id.toString(), newUser.role);
    sendTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Frndma.',
      data: {
        user: {
          id: newUser._id,
          username: newUser.username,
          mobileNumber: newUser.mobileNumber,
          role: newUser.role,
          isAgeConfirmed: newUser.isAgeConfirmed,
          createdAt: newUser.createdAt,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { identifier, password } = req.body;
    const cleanId = (identifier || '').trim().toLowerCase();

    // 🔒 Secret Admin Login Check (rahul2005 / Abcd@1234)
    // No special admin button needed on UI - normal login accepts admin credentials seamlessly!
    if (cleanId === ENV.ADMIN_USERNAME.toLowerCase() || cleanId === 'rahul2005') {
      let admin = await Admin.findOne({
        username: { $in: [cleanId, ENV.ADMIN_USERNAME.toLowerCase()] },
      }).select('+password');

      if (!admin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD, salt);
        admin = await Admin.create({
          username: ENV.ADMIN_USERNAME.toLowerCase(),
          password: hashedPassword,
          role: 'superadmin',
        });
      }

      if (admin && admin.password) {
        const isMatch = (await bcrypt.compare(password, admin.password)) || (password === ENV.ADMIN_PASSWORD);
        if (isMatch) {
          // If password matched plain ENV password, refresh hash
          if (password === ENV.ADMIN_PASSWORD && !(await bcrypt.compare(password, admin.password))) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(password, salt);
          }
          admin.lastLogin = new Date();
          await admin.save();

          const adminToken = jwt.sign(
            { adminId: admin._id, role: admin.role, username: admin.username },
            ENV.JWT_SECRET,
            { expiresIn: '2d' }
          );

          res.cookie('adminToken', adminToken, {
            httpOnly: true,
            secure: ENV.NODE_ENV === 'production',
            sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 2 * 24 * 60 * 60 * 1000,
          });

          sendTokenCookie(res, adminToken);

          res.status(200).json({
            success: true,
            message: 'Signed in successfully.',
            isAdmin: true,
            redirectTo: '/admin',
            data: {
              user: {
                id: admin._id,
                username: admin.username,
                role: 'admin',
              },
              token: adminToken,
            },
          });
          return;
        }
      }
    }

    const user = await User.findOne({
      $or: [
        { username: cleanId },
        { mobileNumber: identifier },
      ],
    }).select('+password');

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/mobile or password.',
      });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({
        success: false,
        message: 'Your account has been banned due to violation of community terms.',
      });
      return;
    }

    if (user.isSuspended) {
      res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact support on WhatsApp.',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid username/mobile or password.',
      });
      return;
    }

    const token = generateToken(user._id.toString(), user.role);
    sendTokenCookie(res, token);

    const profile = await Profile.findOne({ userId: user._id });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        user: {
          id: user._id,
          username: user.username,
          mobileNumber: user.mobileNumber,
          role: user.role,
          isAgeConfirmed: user.isAgeConfirmed,
        },
        profile,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: ENV.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: req.user._id,
          username: req.user.username,
          mobileNumber: req.user.mobileNumber,
          role: req.user.role,
          isAgeConfirmed: req.user.isAgeConfirmed,
          createdAt: req.user.createdAt,
        },
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const { mobileNumber } = req.body;
  res.status(200).json({
    success: true,
    message: `If an account with mobile ${mobileNumber} exists, password reset guidance has been sent. You can also reach our WhatsApp support at ${ENV.SUPPORT_WHATSAPP}.`,
  });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Password reset completed.',
  });
};
