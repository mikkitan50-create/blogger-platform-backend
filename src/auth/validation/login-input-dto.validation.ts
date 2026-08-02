import { body } from 'express-validator';

export const loginInputDtoValidation = [
  body('loginOrEmail')
    .isString().withMessage('loginOrEmail must be a string')
    .trim()
    .notEmpty().withMessage('loginOrEmail is required'),

  body('password')
    .isString().withMessage('password must be a string')
    .trim()
    .notEmpty().withMessage('password is required'),
];