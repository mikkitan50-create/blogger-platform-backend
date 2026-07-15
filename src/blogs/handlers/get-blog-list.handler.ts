import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util';

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    const blogs = await blogsRepository.findAll();
    res.status(HttpStatus.Ok_200).json(blogs.map(mapToBlogViewModel));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}