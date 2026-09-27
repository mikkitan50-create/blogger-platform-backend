import { body } from 'express-validator';
import { LikeStatus } from '../types/comment-like';

export const likeInputDtoValidation = [
  body('likeStatus')
    .isString().withMessage('likeStatus must be a string')
    .isIn(Object.values(LikeStatus)).withMessage('likeStatus must be one of: None, Like, Dislike'),
];