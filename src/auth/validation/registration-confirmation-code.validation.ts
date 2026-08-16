import { body } from 'express-validator';

export const registrationConfirmationCodeValidation = [
  body('code')
    .isString().withMessage('code must be a string')
    .trim()
    .notEmpty().withMessage('code is required'),
];