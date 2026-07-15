import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

export async function getPostListHandler(req: Request, res: Response) {
  try {
    const posts = await postsRepository.findAll();
    res.status(HttpStatus.Ok_200).json(posts.map(mapToPostViewModel));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}