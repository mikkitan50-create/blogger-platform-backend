import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';

export function getPostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  const post = postsRepository.findById(req.params.id);

  if (!post) {
    res.sendStatus(HttpStatus.NotFound_404);
    return;
  }

  res.status(HttpStatus.Ok_200).json(post);
}