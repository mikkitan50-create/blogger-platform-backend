import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { blogsRepository } from '../repositories/blogs.repository';
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util';

export async function getBlogHandler(req: Request<{ id: string }>, res: Response) {
  try {
    const blog = await blogsRepository.findById(req.params.id);
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    res.status(HttpStatus.Ok_200).json(mapToBlogViewModel(blog));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}