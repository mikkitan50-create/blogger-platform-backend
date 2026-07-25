import { param } from 'express-validator';

export const blogIdParamValidation = param('blogId')
  .exists().withMessage('blogId is required')
  .isMongoId().withMessage('blogId must be a valid MongoDB ObjectId');