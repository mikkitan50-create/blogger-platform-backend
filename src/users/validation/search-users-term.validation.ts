import { query } from 'express-validator';

export const searchLoginTermValidation = query('searchLoginTerm')
  .optional({ values: 'falsy' })
  .isString().withMessage('searchLoginTerm must be a string')
  .trim();

export const searchEmailTermValidation = query('searchEmailTerm')
  .optional({ values: 'falsy' })
  .isString().withMessage('searchEmailTerm must be a string')
  .trim();