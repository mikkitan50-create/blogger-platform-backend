import { body } from 'express-validator';

const websiteUrlPattern =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;

export const blogInputDtoValidation = [
  body('name')
    .isString().withMessage('name must be a string')
    .trim()
    .isLength({ min: 1, max: 15 }).withMessage('name max length is 15'),

  body('description')
    .isString().withMessage('description must be a string')
    .trim()
    .isLength({ min: 1, max: 500 }).withMessage('description max length is 500'),

  body('websiteUrl')
    .isString().withMessage('websiteUrl must be a string')
    .trim()
    .isLength({ max: 100 }).withMessage('websiteUrl max length is 100')
    .matches(websiteUrlPattern).withMessage('websiteUrl does not match the template'),
];