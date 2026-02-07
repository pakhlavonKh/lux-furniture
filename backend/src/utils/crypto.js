import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const SALT_ROUNDS = 10;

/**
 * Hash password using bcrypt
 */
export const hash_password = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare password with hash
 */
export const compare_password = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate UUID
 */
export const generate_id = () => {
  return uuidv4();
};

/**
 * Generate transaction ID
 */
export const generate_transaction_id = () => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate email format
 */
export const is_valid_email = (email) => {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
};

/**
 * Validate password strength
 */
export const is_valid_password = (password) => {
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
export const is_valid_phone_uz = (phone) => {
  // Uzbek phone format: +998xxxxxxxxx or 998xxxxxxxxx
  const phone_regex = /^(\+?998|0)[0-9]{9}$/;
  return phone_regex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Format phone number to standard format
 */
export const format_phone_uz = (phone) => {
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
export const mask_email = (email) => {
  const [name, domain] = email.split('@');
  const masked_name = name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  return `${masked_name}@${domain}`;
};
