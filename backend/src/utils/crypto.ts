import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate UUID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Generate transaction ID
 */
export const generateTransactionId = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
};

/**
 * Validate phone number (Uzbekistan format)
 */
export const isValidPhoneUz = (phone: string): boolean => {
  // Uzbek phone format: +998xxxxxxxxx or 998xxxxxxxxx
  const phoneRegex = /^(\+?998|0)[0-9]{9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Format phone number to standard format
 */
export const formatPhoneUz = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return '+' + cleaned;
  }
  if (cleaned.length === 9) {
    return '+998' + cleaned;
  }
  return phone;
};

/**
 * Mask email for display
 */
export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  const maskedName = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${maskedName}@${domain}`;
};
