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