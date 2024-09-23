import * as yup from 'yup';

export const registerSchema = yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password cannot be more than 20 characters'),
});

export const loginSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required().min(8, 'Password must be at least 8 characters').max(20, 'Password cannot be more than 20 characters'),
});