import { body } from 'express-validator';

export const newPasswordRecoveryInputDtoValidation = [
  body('newPassword')
    .isString().withMessage('newPassword must be a string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('newPassword length must be between 6 and 20'),

  body('recoveryCode')
    .isString().withMessage('recoveryCode must be a string')
    .trim()
    .notEmpty().withMessage('recoveryCode is required'),
];