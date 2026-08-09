import { param } from 'express-validator';

export const commentIdParamValidation = param('commentId')
  .exists().withMessage('commentId is required')
  .isMongoId().withMessage('commentId must be a valid MongoDB ObjectId');