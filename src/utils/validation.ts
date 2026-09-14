export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

const VALID: ValidationResult = { isValid: true };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const MIN_PASSWORD_LENGTH = 6;

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return { isValid: false, error: 'Enter a valid email address' };
  }
  return VALID;
}

export function validatePassword(password: string): ValidationResult {
  if (password.length === 0) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    };
  }
  return VALID;
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string,
): ValidationResult {
  if (confirmation.length === 0) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  if (password !== confirmation) {
    return { isValid: false, error: 'Passwords do not match' };
  }
  return VALID;
}

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function validateEventTitle(title: string): ValidationResult {
  const trimmed = title.trim();

  if (trimmed.length === 0) {
    return { isValid: false, error: 'Title is required' };
  }
  if (trimmed.length > 80) {
    return { isValid: false, error: 'Title must be 80 characters or fewer' };
  }
  return VALID;
}

export function validateTime(value: string): ValidationResult {
  if (value.trim().length === 0) {
    return { isValid: false, error: 'Time is required' };
  }
  if (!TIME_PATTERN.test(value.trim())) {
    return { isValid: false, error: 'Use 24-hour format, e.g. 14:30' };
  }
  return VALID;
}

export function validateTimeRange(start: string, end: string): ValidationResult {
  const startResult = validateTime(start);
  const endResult = validateTime(end);

  if (!startResult.isValid || !endResult.isValid) {
    return VALID;
  }
  if (end <= start) {
    return { isValid: false, error: 'End time must be after start time' };
  }
  return VALID;
}