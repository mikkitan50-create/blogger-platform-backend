import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { PostInputModel } from '../types/post';

export function createPostHandler(
  req: Request<{}, {}, PostInputModel>,
  res: Response,
) {
  const newPost = postsRepository.create(req.body);

  if (!newPost) {
    res.sendStatus(HttpStatus.BadRequest_400);
    return;
  }

  res.status(HttpStatus.Created_201).json(newPost);
}