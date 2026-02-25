import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import User from '../models/user_model.js';

export const authenticate_token = (req, res, next) => {
  const auth_header = req.headers['authorization'];
  const token = auth_header && auth_header.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access token required',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user_id = decoded.user_id;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({
        success: false,
        message: 'Invalid token',
      });
    } else {
      res.status(403).json({
        success: false,
        message: 'Token verification failed',
      });
    }
  }
};

export const authorize_admin = async (req, res, next) => {
  try {
    // This middleware should be used after authenticate_token
    if (!req.user_id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const user = await User.findById(req.user_id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.is_admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    res.status(500).json({
      success: false,
      message: 'Authorization check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const optional_auth = (req, res, next) => {
  const auth_header = req.headers['authorization'];
  const token = auth_header && auth_header.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user_id = decoded.user_id;
      req.user = decoded;
    } catch (error) {
      // Token is invalid or expired, continue without authentication
      console.warn(
        'Optional auth token verification failed:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  next();
};
