import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';
import { BlogInputModel } from '../types/blog';
import { mapBlogInputDtoToBlog } from '../utils/map-blog-input-dto-to-blog.util';
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util';

export async function createBlogHandler(
  req: Request<{}, {}, BlogInputModel>,
  res: Response,
) {
  try {
    const newBlog = {
      ...mapBlogInputDtoToBlog(req.body),
      createdAt: new Date(),
    };
    const createdBlog = await blogsRepository.create(newBlog);
    res.status(HttpStatus.Created_201).json(mapToBlogViewModel(createdBlog));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}