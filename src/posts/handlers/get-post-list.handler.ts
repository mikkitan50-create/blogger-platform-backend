import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';

export function getPostListHandler(req: Request, res: Response) {
  const posts = postsRepository.findAll();
  res.status(HttpStatus.Ok_200).json(posts);
}