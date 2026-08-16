import { body } from 'express-validator';

export const registrationEmailResendingValidation = [
  body('email')
    .isString().withMessage('email must be a string')
    .trim()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)
    .withMessage('email must be a valid email address'),
];