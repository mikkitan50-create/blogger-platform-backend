import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { commentsRepository } from '../repositories/comments.repository';
import { mapToCommentViewModel } from '../utils/map-to-comment-view-model.util';

export async function getCommentsForPostHandler(
  req: Request<{ postId: string }>,
  res: Response,
) {
  try {
    const postId = req.params.postId;

    const post = await postsRepository.findById(postId);
    if (!post) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const { sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

    const { items, totalCount } = await commentsRepository.findManyByPostId(postId, {
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const paginatedOutput = mapToPaginatedOutput(items.map(mapToCommentViewModel), {
      page: pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok_200).json(paginatedOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}