import crypto from 'crypto';

/**
 * Generate a UUID v4
 * @returns {string} UUID string
 */
export const generateUUID = () => {
  return crypto.randomUUID();
};

/**
 * Validate UUID format
 * @param {string} uuid 
 * @returns {boolean}
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
