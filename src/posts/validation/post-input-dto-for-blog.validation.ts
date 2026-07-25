import { body } from 'express-validator';

export const postInputDtoForBlogValidation = [
  body('title')
    .isString().withMessage('title must be a string')
    .trim()
    .isLength({ min: 1, max: 30 }).withMessage('title max length is 30'),

  body('shortDescription')
    .isString().withMessage('shortDescription must be a string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('shortDescription max length is 100'),

  body('content')
    .isString().withMessage('content must be a string')
    .trim()
    .isLength({ min: 1, max: 1000 }).withMessage('content max length is 1000'),
];