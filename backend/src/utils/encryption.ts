import CryptoJS from 'crypto-js';

/**
 * Generate HMAC SHA256 signature
 */
export const generateSignature = (data: string, secretKey: string): string => {
  return CryptoJS.HmacSHA256(data, secretKey).toString();
};

/**
 * Verify HMAC SHA256 signature
 */
export const verifySignature = (data: string, signature: string, secretKey: string): boolean => {
  const expectedSignature = generateSignature(data, secretKey);
  return expectedSignature === signature;
};

/**
 * Encrypt data (for sensitive information)
 */
export const encryptData = (data: string, key: string): string => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypt data
 */
export const decryptData = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Generate MD5 hash (used by some payment systems)
 */
export const generateMD5Hash = (data: string): string => {
  return CryptoJS.MD5(data).toString();
};

/**
 * Generate SHA256 hash
 */
export const generateSHA256Hash = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};
