import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { TYPES } from '../../composition/types';
import { PostsService } from '../application/posts.service';
import { PostInputModel } from '../types/post';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

type PostForBlogInputBody = {
  title: string;
  shortDescription: string;
  content: string;
};

@injectable()
export class PostsController {
  constructor(
    @inject(TYPES.PostsService) private postsService: PostsService,
  ) {}

  getPostList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

      const { items, totalCount } = await this.postsService.getPostList({
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      const paginatedOutput = mapToPaginatedOutput(items.map(mapToPostViewModel), {
        page: pageNumber,
        pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok_200).json(paginatedOutput);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  getPostsForBlog = async (req: Request<{ blogId: string }>, res: Response): Promise<void> => {
    try {
      const { sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

      const result = await this.postsService.getPostsForBlog(req.params.blogId, {
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      if (!result) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }

      const paginatedOutput = mapToPaginatedOutput(result.items.map(mapToPostViewModel), {
        page: pageNumber,
        pageSize,
        totalCount: result.totalCount,
      });

      res.status(HttpStatus.Ok_200).json(paginatedOutput);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  getPost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const post = await this.postsService.getPostById(req.params.id);
      if (!post) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.status(HttpStatus.Ok_200).json(mapToPostViewModel(post));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  createPost = async (req: Request<{}, {}, PostInputModel>, res: Response): Promise<void> => {
    try {
      const createdPost = await this.postsService.createPost(req.body);
      if (!createdPost) {
        res.sendStatus(HttpStatus.BadRequest_400);
        return;
      }
      res.status(HttpStatus.Created_201).json(mapToPostViewModel(createdPost));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  createPostForBlog = async (
    req: Request<{ blogId: string }, {}, PostForBlogInputBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const createdPost = await this.postsService.createPostForBlog(req.params.blogId, req.body);
      if (!createdPost) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.status(HttpStatus.Created_201).json(mapToPostViewModel(createdPost));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  updatePost = async (
    req: Request<{ id: string }, {}, PostInputModel>,
    res: Response,
  ): Promise<void> => {
    try {
      const isUpdated = await this.postsService.updatePost(req.params.id, req.body);
      if (!isUpdated) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  deletePost = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const isDeleted = await this.postsService.deletePost(req.params.id);
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