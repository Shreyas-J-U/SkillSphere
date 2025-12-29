// Standardized error messages and codes for consistent API responses

export const ErrorCodes = {
  // Authentication errors (1xxx)
  AUTH_TOKEN_MISSING: 1001,
  AUTH_TOKEN_INVALID: 1002,
  AUTH_TOKEN_EXPIRED: 1003,
  AUTH_UNAUTHORIZED: 1004,
  AUTH_FORBIDDEN: 1005,

  // Validation errors (2xxx)
  VALIDATION_FAILED: 2001,
  VALIDATION_MISSING_FIELD: 2002,
  VALIDATION_INVALID_FORMAT: 2003,
  VALIDATION_OUT_OF_RANGE: 2004,

  // Resource errors (3xxx)
  RESOURCE_NOT_FOUND: 3001,
  RESOURCE_ALREADY_EXISTS: 3002,
  RESOURCE_CONFLICT: 3003,

  // Business logic errors (4xxx)
  BARTER_ALREADY_PENDING: 4001,
  BARTER_NOT_ACCEPTED: 4002,
  BARTER_NOT_COMPLETED: 4003,
  SESSION_ALREADY_EXISTS: 4004,
  SESSION_NOT_READY: 4005,
  RATING_ALREADY_SUBMITTED: 4006,

  // Server errors (5xxx)
  SERVER_ERROR: 5001,
  DATABASE_ERROR: 5002,
  EMAIL_SERVICE_ERROR: 5003,
};

export const ErrorMessages = {
  // Authentication
  [ErrorCodes.AUTH_TOKEN_MISSING]: "No authentication token provided",
  [ErrorCodes.AUTH_TOKEN_INVALID]: "Invalid authentication token",
  [ErrorCodes.AUTH_TOKEN_EXPIRED]: "Authentication token has expired",
  [ErrorCodes.AUTH_UNAUTHORIZED]: "Unauthorized access",
  [ErrorCodes.AUTH_FORBIDDEN]:
    "You don't have permission to perform this action",

  // Validation
  [ErrorCodes.VALIDATION_FAILED]: "Validation failed",
  [ErrorCodes.VALIDATION_MISSING_FIELD]: "Required field is missing",
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: "Invalid format",
  [ErrorCodes.VALIDATION_OUT_OF_RANGE]: "Value is out of acceptable range",

  // Resources
  [ErrorCodes.RESOURCE_NOT_FOUND]: "Resource not found",
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: "Resource already exists",
  [ErrorCodes.RESOURCE_CONFLICT]: "Resource conflict",

  // Business logic
  [ErrorCodes.BARTER_ALREADY_PENDING]:
    "You already have a pending request with this user",
  [ErrorCodes.BARTER_NOT_ACCEPTED]: "Barter request must be accepted first",
  [ErrorCodes.BARTER_NOT_COMPLETED]: "Can only rate completed barters",
  [ErrorCodes.SESSION_ALREADY_EXISTS]: "Session already exists for this barter",
  [ErrorCodes.SESSION_NOT_READY]: "Both participants must be ready",
  [ErrorCodes.RATING_ALREADY_SUBMITTED]: "You have already rated this barter",

  // Server
  [ErrorCodes.SERVER_ERROR]: "Internal server error",
  [ErrorCodes.DATABASE_ERROR]: "Database operation failed",
  [ErrorCodes.EMAIL_SERVICE_ERROR]: "Email service is currently unavailable",
};

/**
 * Create a standardized error response
 * @param {number} code - Error code from ErrorCodes
 * @param {string} customMessage - Optional custom message to override default
 * @param {object} details - Optional additional details
 * @returns {object} Standardized error object
 */
export const createError = (code, customMessage = null, details = null) => {
  const error = {
    code,
    message: customMessage || ErrorMessages[code] || "Unknown error",
  };

  if (details) {
    error.details = details;
  }

  return error;
};

/**
 * Send a standardized error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {number} errorCode - Error code from ErrorCodes
 * @param {string} customMessage - Optional custom message
 * @param {object} details - Optional additional details
 */
export const sendError = (
  res,
  statusCode,
  errorCode,
  customMessage = null,
  details = null
) => {
  return res
    .status(statusCode)
    .json(createError(errorCode, customMessage, details));
};

export default {
  ErrorCodes,
  ErrorMessages,
  createError,
  sendError,
};
