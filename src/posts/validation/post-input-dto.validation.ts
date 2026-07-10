// src/posts/validation/post-input-dto.validation.ts

import { body } from 'express-validator';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';

export const postInputDtoValidation = [
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

  body('blogId')
    .isString().withMessage('blogId must be a string')
    .custom((value) => {
      const blog = blogsRepository.findById(value);
      if (!blog) {
        throw new Error('blog with this id does not exist');
      }
      return true;
    }),
];