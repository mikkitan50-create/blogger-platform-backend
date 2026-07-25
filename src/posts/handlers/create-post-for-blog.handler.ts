import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { postsRepository } from '../repositories/posts.repository';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

type PostForBlogInputBody = {
  title: string;
  shortDescription: string;
  content: string;
};

export async function createPostForBlogHandler(
  req: Request<{ blogId: string }, {}, PostForBlogInputBody>,
  res: Response,
) {
  try {
    const blogId = req.params.blogId;

    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const newPostData = {
      title: req.body.title,
      shortDescription: req.body.shortDescription,
      content: req.body.content,
      blogId,
      createdAt: new Date(),
    };

    const createdPost = await postsRepository.create(newPostData);
    if (!createdPost) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    res.status(HttpStatus.Created_201).json(mapToPostViewModel(createdPost));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}