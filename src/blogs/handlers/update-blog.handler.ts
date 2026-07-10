import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';
import { BlogInputModel } from '../types/blog';

export function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogInputModel>,
  res: Response,
) {
  const isUpdated = blogsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204);
}