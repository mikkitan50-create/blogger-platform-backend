import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { postsRepository } from '../repositories/posts.repository';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';

export async function getPostsForBlogHandler(
  req: Request<{ blogId: string }>,
  res: Response,
) {
  try {
    const blogId = req.params.blogId;

    const blog = await blogsRepository.findById(blogId);
    if (!blog) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const { sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

    const { items, totalCount } = await postsRepository.findManyByBlogId(blogId, {
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
}