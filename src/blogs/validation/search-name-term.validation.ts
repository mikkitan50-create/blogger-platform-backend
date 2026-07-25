import { query } from 'express-validator';

export const searchNameTermValidation = query('searchNameTerm')
  .optional({ values: 'falsy' })
  .isString().withMessage('searchNameTerm must be a string')
  .trim();