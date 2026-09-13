import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { BlogsService } from '../application/blogs.service';
import { BlogInputModel } from '../types/blog';
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util';

export class BlogsController {
  constructor(private blogsService: BlogsService) {}

  getBlogList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

      const { items, totalCount } = await this.blogsService.getBlogList({
        searchNameTerm: searchNameTerm || null,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      const paginatedOutput = mapToPaginatedOutput(items.map(mapToBlogViewModel), {
        page: pageNumber,
        pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok_200).json(paginatedOutput);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  getBlog = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const blog = await this.blogsService.getBlogById(req.params.id);
      if (!blog) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.status(HttpStatus.Ok_200).json(mapToBlogViewModel(blog));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  createBlog = async (req: Request<{}, {}, BlogInputModel>, res: Response): Promise<void> => {
    try {
      const createdBlog = await this.blogsService.createBlog(req.body);
      res.status(HttpStatus.Created_201).json(mapToBlogViewModel(createdBlog));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  updateBlog = async (
    req: Request<{ id: string }, {}, BlogInputModel>,
    res: Response,
  ): Promise<void> => {
    try {
      const isUpdated = await this.blogsService.updateBlog(req.params.id, req.body);
      if (!isUpdated) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  deleteBlog = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const isDeleted = await this.blogsService.deleteBlog(req.params.id);
      if (!isDeleted) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}