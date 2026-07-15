import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

export async function getPostHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const post = await postsRepository.findById(req.params.id);
    if (!post) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    res.status(HttpStatus.Ok_200).json(mapToPostViewModel(post));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}