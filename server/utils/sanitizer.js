import validator from "validator";

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== "string") return input;

  // Escape HTML to prevent XSS
  return validator.escape(input.trim());
};

/**
 * Sanitize email input
 * @param {string} email - Email to sanitize
 * @returns {string} Sanitized and normalized email
 */
export const sanitizeEmail = (email) => {
  if (typeof email !== "string") return email;

  const normalized = validator.normalizeEmail(email);
  return normalized ? validator.escape(normalized) : email;
};

/**
 * Sanitize URL input
 * @param {string} url - URL to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
export const sanitizeURL = (url) => {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();

  // Validate URL format
  if (!validator.isURL(trimmed, { require_protocol: true })) {
    return null;
  }

  return trimmed;
};

/**
 * Sanitize an object's string properties
 * @param {object} obj - Object to sanitize
 * @param {array} fields - Array of field names to sanitize
 * @returns {object} Object with sanitized fields
 */
export const sanitizeObject = (obj, fields) => {
  const sanitized = { ...obj };

  fields.forEach((field) => {
    if (sanitized[field] && typeof sanitized[field] === "string") {
      sanitized[field] = sanitizeString(sanitized[field]);
    }
  });

  return sanitized;
};

/**
 * Validate and sanitize rating value
 * @param {number} rating - Rating value
 * @returns {number|null} Valid rating or null
 */
export const sanitizeRating = (rating) => {
  const num = Number(rating);

  if (isNaN(num) || num < 1 || num > 5) {
    return null;
  }

  return Math.round(num * 10) / 10; // Round to 1 decimal place
};

/**
 * Validate and sanitize pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {number} maxLimit - Maximum allowed limit
 * @returns {object} Sanitized pagination params
 */
export const sanitizePagination = (page, limit, maxLimit = 100) => {
  const sanitizedPage = Math.max(parseInt(page) || 1, 1);
  const sanitizedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), maxLimit);

  return {
    page: sanitizedPage,
    limit: sanitizedLimit,
    skip: (sanitizedPage - 1) * sanitizedLimit,
  };
};

/**
 * Remove potentially dangerous characters from skill names
 * @param {string} skill - Skill name
 * @returns {string} Sanitized skill name
 */
export const sanitizeSkill = (skill) => {
  if (typeof skill !== "string") return "";

  // Remove HTML tags and trim
  const cleaned = validator.stripLow(skill.trim());

  // Limit length
  return cleaned.substring(0, 100);
};

/**
 * Sanitize array of strings
 * @param {array} arr - Array of strings
 * @param {function} sanitizer - Sanitization function to apply
 * @returns {array} Sanitized array
 */
export const sanitizeArray = (arr, sanitizer = sanitizeString) => {
  if (!Array.isArray(arr)) return [];

  return arr
    .filter((item) => item !== null && item !== undefined)
    .map((item) => sanitizer(item))
    .filter((item) => item && item.length > 0);
};

export default {
  sanitizeString,
  sanitizeEmail,
  sanitizeURL,
  sanitizeObject,
  sanitizeRating,
  sanitizePagination,
  sanitizeSkill,
  sanitizeArray,
};
