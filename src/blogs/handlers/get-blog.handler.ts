import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';

export function getBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const blog = blogsRepository.findById(req.params.id);

  if (!blog) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.status(HttpStatus.Ok_200).json(blog);
}