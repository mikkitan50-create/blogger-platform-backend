import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';

export function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const isDeleted = blogsRepository.delete(req.params.id);

  if (!isDeleted) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204);
}