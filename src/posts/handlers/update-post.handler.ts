import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { PostInputModel } from '../types/post';

export function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputModel>,
  res: Response,
) {
  const isUpdated = postsRepository.update(req.params.id, req.body);

  if (!isUpdated) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.sendStatus(HttpStatus.NoContent_204);
}