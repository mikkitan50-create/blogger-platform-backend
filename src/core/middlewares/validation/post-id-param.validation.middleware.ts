import { param } from 'express-validator';

export const postIdParamValidation = param('postId')
  .exists().withMessage('postId is required')
  .isMongoId().withMessage('postId must be a valid MongoDB ObjectId');