import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateForm, type LeadFormData } from '../validators';

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('name.last@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@gmail.com')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('noatsign.com')).toBe(false);
    expect(validateEmail('@nodomain')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('user @space.com')).toBe(false);
  });
});

describe('validatePhone', () => {
  it('accepts valid phone numbers', () => {
    expect(validatePhone('+1234567890')).toBe(true);
    expect(validatePhone('1234567890')).toBe(true);
    expect(validatePhone('+972501234567')).toBe(true);
  });

  it('accepts phone numbers with spaces (stripped)', () => {
    expect(validatePhone('+1 234 567 890')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('abc')).toBe(false);
    expect(validatePhone('+0123456789')).toBe(false); // starts with 0 after +
  });
});

describe('validateForm', () => {
  const validForm: LeadFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Inc',
    website: 'https://example.com',
    phone: '+1234567890',
    message: 'Hello',
  };

  it('validates a complete, correct form', () => {
    const result = validateForm(validForm);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('requires name', () => {
    const result = validateForm({ ...validForm, name: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Name is required');
  });

  it('requires email', () => {
    const result = validateForm({ ...validForm, email: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email is required');
  });

  it('validates email format', () => {
    const result = validateForm({ ...validForm, email: 'invalid' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid email address');
  });

  it('requires company', () => {
    const result = validateForm({ ...validForm, company: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Company is required');
  });

  it('validates phone format when provided', () => {
    const result = validateForm({ ...validForm, phone: 'notaphone' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Please enter a valid phone number');
  });

  it('allows empty phone', () => {
    const result = validateForm({ ...validForm, phone: '' });
    expect(result.isValid).toBe(true);
  });

  it('validates website starts with http', () => {
    const result = validateForm({ ...validForm, website: 'example.com' });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Website must start with http:// or https://');
  });

  it('allows empty website', () => {
    const result = validateForm({ ...validForm, website: '' });
    expect(result.isValid).toBe(true);
  });

  it('collects multiple errors', () => {
    const result = validateForm({ name: '', email: '', company: '', website: '', phone: '', message: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});
