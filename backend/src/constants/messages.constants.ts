export const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: 'Registration successful',
    LOGIN_SUCCESS: 'Login successful',
    USER_EXISTS: 'A user with this email already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized. Please login to continue',
    TOKEN_MISSING: 'Access token is missing',
    TOKEN_INVALID: 'Access token is invalid or expired',
    PASSWORD_MISMATCH: 'Passwords do not match',
  },
  URL: {
    CREATE_SUCCESS: 'Short URL created successfully',
    FETCH_SUCCESS: 'URLs fetched successfully',
    NOT_FOUND: 'Short URL not found',
    INVALID_URL: 'Please provide a valid URL',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please provide a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN: 'Password must be at least 8 characters',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    URL_REQUIRED: 'Original URL is required',
    URL_INVALID: 'Please provide a valid URL starting with http:// or https://',
  },
  SERVER: {
    INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
    NOT_FOUND: 'The requested resource was not found',
  },
} as const;
