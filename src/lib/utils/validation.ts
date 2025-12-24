import { CollectionFormData } from '@/lib/types/collection-form.types';

export interface ValidationErrors {
    firstName?: string;
    lastName?: string;
    zipcode?: string;
    helpType?: string;
    contactMethod?: string;
    email?: string;
    phone?: string;
    videoUrl?: string;
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
    return {
        hasMinLength: password.length >= 6,
        hasNumberOrSymbol: /[0-9!@#$%^&*]/.test(password),
        hasUpperAndLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    };
};

export const isPasswordValid = (password: string): boolean => {
    const validation = validatePassword(password);
    return validation.hasMinLength && validation.hasNumberOrSymbol && validation.hasUpperAndLower;
};

export const validatePhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10;
};

export const validateZipcode = (zipcode: string): boolean => {
    return zipcode.trim().length >= 5 && /^[0-9]{5,}$/.test(zipcode);
};

export const validateStep1 = (formData: CollectionFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.videoUrl) {
        errors.videoUrl = 'Please upload a video';
    }

    return errors;
};

export const validateStep2 = (formData: CollectionFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.zipcode.trim()) {
        errors.zipcode = 'Zipcode is required';
    } else if (!validateZipcode(formData.zipcode)) {
        errors.zipcode = 'Please enter a valid zipcode (min 5 digits)';
    }

    if (!formData.helpType) {
        errors.helpType = 'Please select a service option';
    }

    return errors;
};

export const validateStep3 = (formData: CollectionFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    const hasEmail = formData.email.trim().length > 0;

    // Check if phone has actual digits (not just country code)
    // Country codes are typically 1-4 digits, so if cleaned phone has more than 4 digits, user entered something
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    const hasPhone = cleanedPhone.length > 4; // More than just country code

    // Require at least one contact method
    if (!hasEmail && !hasPhone) {
        errors.contactMethod = 'Please provide at least one contact method (email or phone)';
    }

    // Validate email format if provided
    if (hasEmail && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Validate phone format if provided (only if user actually entered digits)
    if (hasPhone && !validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number (min 10 digits)';
    }

    return errors;
};

export const validateForm = (formData: CollectionFormData): ValidationErrors => {
    return {
        ...validateStep1(formData),
        ...validateStep2(formData),
        ...validateStep3(formData),
    };
};
