import { body } from 'express-validator';

export const userInputDtoValidation = [
  body('login')
    .isString().withMessage('login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 }).withMessage('login length must be between 3 and 10')
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('login must contain only letters, digits, underscore and dash'),

  body('password')
    .isString().withMessage('password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('password length must be between 6 and 20'),

  body('email')
    .isString().withMessage('email must be a string')
    .trim()
    .matches(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/).withMessage('email must be a valid email address'),
];