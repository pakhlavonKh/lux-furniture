import CryptoJS from 'crypto-js';

/**
 * Generate HMAC SHA256 signature
 */
export const generate_signature = (data, secret_key) => {
  return CryptoJS.HmacSHA256(data, secret_key).toString();
};

/**
 * Verify HMAC SHA256 signature
 */
export const verify_signature = (data, signature, secret_key) => {
  const expected_signature = generate_signature(data, secret_key);
  return expected_signature === signature;
};

/**
 * Encrypt data (for sensitive information)
 */
export const encrypt_data = (data, key) => {
  return CryptoJS.AES.encrypt(data, key).toString();
};

/**
 * Decrypt data
 */
export const decrypt_data = (encrypted_data, key) => {
  const bytes = CryptoJS.AES.decrypt(encrypted_data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Generate MD5 hash (used by some payment systems)
 */
export const generate_md5_hash = (data) => {
  return CryptoJS.MD5(data).toString();
};

/**
 * Generate SHA256 hash
 */
export const generate_sha256_hash = (data) => {
  return CryptoJS.SHA256(data).toString();
};
