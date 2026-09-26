import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyPattern?: Record<string, any>;
  keyValue?: Record<string, any>;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // MongoDB E11000 Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || '';
    if (field === 'username' || err.message?.includes('username')) {
      message = 'Username is already taken. Please choose another.';
    } else if (field === 'mobileNumber' || field === 'mobile' || err.message?.includes('mobile')) {
      message = 'Mobile number already registered. Please log in.';
    } else {
      message = `${field ? field.charAt(0).toUpperCase() + field.slice(1) : 'Field'} already exists.`;
    }
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e: any) => e.message);
    message = messages[0] || 'Validation error';
  }

  // Mongoose CastError (invalid ObjectId or type)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid request parameters';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

