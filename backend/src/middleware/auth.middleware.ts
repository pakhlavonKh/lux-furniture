import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AuthPayload } from '../types/auth.types.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: AuthPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: 'Invalid token'
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Token verification failed'
      });
    }
  }
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as AuthPayload;
      req.userId = decoded.userId;
      req.user = decoded;
    } catch (error) {
      // Token is invalid or expired, continue without authentication
      console.warn('Optional auth token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  next();
};
