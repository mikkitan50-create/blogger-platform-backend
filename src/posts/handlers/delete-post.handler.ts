import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';

export async function deletePostHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const isDeleted = await postsRepository.delete(req.params.id);
    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}