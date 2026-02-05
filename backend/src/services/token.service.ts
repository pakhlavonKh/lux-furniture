import jwt from 'jsonwebtoken';
import { config } from '../config/index';
import { AuthPayload } from '../types/auth.types';

export const generateAccessToken = (userId: string, email: string): string => {
  const payload: AuthPayload = {
    userId,
    email
  };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
};

export const generateRefreshToken = (userId: string): string => {
  const payload = { userId };

  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const verifyToken = (token: string): AuthPayload | null => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as AuthPayload;
  } catch (error) {
    return null;
  }
};

export const decodeToken = (token: string): AuthPayload | null => {
  try {
    return jwt.decode(token) as AuthPayload | null;
  } catch (error) {
    return null;
  }
};
