import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../repositories/posts.repository';
import { PostInputModel } from '../types/post';
import { mapPostInputDtoToPost } from '../utils/map-post-input-dto-to-post.util';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

export async function createPostHandler(
  req: Request<{}, {}, PostInputModel>,
  res: Response,
) {
  try {
    const newPostData = {
      ...mapPostInputDtoToPost(req.body),
      createdAt: new Date(),
    };
    const createdPost = await postsRepository.create(newPostData);
    if (!createdPost) {
      res.sendStatus(HttpStatus.BadRequest_400);
      return;
    }
    res.status(HttpStatus.Created_201).json(mapToPostViewModel(createdPost));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}