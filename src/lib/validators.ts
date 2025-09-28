export interface LeadFormData {
  name: string;
  email: string;
  company: string;
  website: string;
  phone: string;
  message: string;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function validateForm(data: LeadFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.email.trim()) {
    errors.push('Email is required');
  } else if (!validateEmail(data.email)) {
    errors.push('Please enter a valid email address');
  }

  if (!data.company.trim()) {
    errors.push('Company is required');
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Please enter a valid phone number');
  }

  if (data.website && !data.website.startsWith('http')) {
    errors.push('Website must start with http:// or https://');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
