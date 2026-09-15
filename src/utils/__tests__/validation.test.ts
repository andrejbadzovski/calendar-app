import {
  validateEmail,
  validateEventTitle,
  validatePassword,
  validatePasswordConfirmation,
  validateTime,
  validateTimeRange,
  MIN_PASSWORD_LENGTH,
} from '../validation';

describe('validateEmail', () => {
  it('accepts a well formed address', () => {
    expect(validateEmail('user@example.com').isValid).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(validateEmail('  user@example.com  ').isValid).toBe(true);
  });

  it('rejects an empty value', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it.each(['user', 'user@', '@example.com', 'user@example', 'user @example.com'])(
    'rejects %s',
    value => {
      expect(validateEmail(value).isValid).toBe(false);
    },
  );
});

describe('validatePassword', () => {
  it('accepts a password of the minimum length', () => {
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH)).isValid).toBe(true);
  });

  it('rejects a password below the minimum length', () => {
    expect(validatePassword('a'.repeat(MIN_PASSWORD_LENGTH - 1)).isValid).toBe(false);
  });

  it('rejects an empty password', () => {
    expect(validatePassword('').error).toBe('Password is required');
  });
});

describe('validatePasswordConfirmation', () => {
  it('accepts matching passwords', () => {
    expect(validatePasswordConfirmation('secret1', 'secret1').isValid).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    expect(validatePasswordConfirmation('secret1', 'secret2').error).toBe(
      'Passwords do not match',
    );
  });

  it('rejects an empty confirmation', () => {
    expect(validatePasswordConfirmation('secret1', '').isValid).toBe(false);
  });
});

describe('validateEventTitle', () => {
  it('accepts a normal title', () => {
    expect(validateEventTitle('Team standup').isValid).toBe(true);
  });

  it('rejects an empty title', () => {
    expect(validateEventTitle('').error).toBe('Title is required');
  });

  it('rejects a whitespace only title', () => {
    expect(validateEventTitle('   ').isValid).toBe(false);
  });

  it('accepts a title of exactly 80 characters', () => {
    expect(validateEventTitle('a'.repeat(80)).isValid).toBe(true);
  });

  it('rejects a title longer than 80 characters', () => {
    expect(validateEventTitle('a'.repeat(81)).isValid).toBe(false);
  });
});

describe('validateTime', () => {
  it.each(['00:00', '09:30', '23:59'])('accepts %s', value => {
    expect(validateTime(value).isValid).toBe(true);
  });

  it.each(['24:00', '9:30', '23:60', 'abcde', '12:5', ''])('rejects %s', value => {
    expect(validateTime(value).isValid).toBe(false);
  });
});

describe('validateTimeRange', () => {
  it('accepts an end time after the start time', () => {
    expect(validateTimeRange('09:00', '10:00').isValid).toBe(true);
  });

  it('rejects an end time equal to the start time', () => {
    expect(validateTimeRange('09:00', '09:00').isValid).toBe(false);
  });

  it('rejects an end time before the start time', () => {
    expect(validateTimeRange('10:00', '09:00').error).toBe(
      'End time must be after start time',
    );
  });

  it('defers to the individual time validators when a value is malformed', () => {
    expect(validateTimeRange('nonsense', '10:00').isValid).toBe(true);
  });
});
