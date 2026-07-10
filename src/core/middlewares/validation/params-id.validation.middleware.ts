// src/core/middlewares/validation/params-id.validation.middleware.ts

import { param } from 'express-validator';

export const idValidation = param('id')
  .exists().withMessage('id is required')
  .isString().withMessage('id must be a string')
  .trim()
  .isLength({ min: 1 }).withMessage('id must not be empty');