import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';
import { BlogInputModel } from '../types/blog';

export function createBlogHandler(
  req: Request<{}, {}, BlogInputModel>,
  res: Response,
) {
  const newBlog = blogsRepository.create(req.body);
  res.status(HttpStatus.Created_201).json(newBlog);
}