import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';

export function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const isDeleted = postsRepository.delete(req.params.id);

  if (!isDeleted) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204);
}