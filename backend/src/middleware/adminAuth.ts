import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { AuthRequest } from './auth';
import { Admin } from '../models/Admin';
import { User } from '../models/User';

export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined = req.cookies?.adminToken || req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Admin authorization required.',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { adminId?: string; userId?: string; role?: string };

    if (decoded.adminId) {
      const admin = await Admin.findById(decoded.adminId);
      if (admin) {
        req.user = undefined;
        next();
        return;
      }
    }

    if (decoded.userId) {
      const user = await User.findById(decoded.userId);
      if (user && user.role === 'admin') {
        req.user = user;
        req.userId = user._id.toString();
        next();
        return;
      }
    }

    res.status(403).json({
      success: false,
      message: 'Access denied: Administrative privileges required.',
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired admin session.',
    });
  }
};
