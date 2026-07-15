import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { PostInputModel } from '../types/post';

export async function updatePostHandler(
  req: Request<{ id: string }, {}, PostInputModel>,
  res: Response,
) {
  try {
    const isUpdated = await postsRepository.update(req.params.id, req.body);
    if (!isUpdated) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}