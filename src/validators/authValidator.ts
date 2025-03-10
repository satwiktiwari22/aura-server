import * as yup from 'yup';

// const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const registerSchema = yup.object({
    name: yup.string().required(),
    phone_number: yup.string().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password cannot be more than 20 characters'),
});

export const loginSchema = yup.object({
    phone_number: yup.string().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password cannot be more than 20 characters'),
});