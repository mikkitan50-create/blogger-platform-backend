import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { TYPES } from '../../composition/types';
import { CommentsService } from '../application/comments.service';
import { CommentInputModel } from '../types/comment';
import { LikeInputModel } from '../types/comment-like';
import { mapToCommentViewModel } from '../utils/map-to-comment-view-model.util';

@injectable()
export class CommentsController {
  constructor(
    @inject(TYPES.CommentsService) private commentsService: CommentsService,
  ) {}

  getCommentsForPost = async (req: Request<{ postId: string }>, res: Response): Promise<void> => {
    try {
      const { sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

      const result = await this.commentsService.getCommentsForPost(
        req.params.postId,
        { sortBy, sortDirection, pageNumber, pageSize },
        req.userId ?? null,
      );

      if (!result) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }

      const paginatedOutput = mapToPaginatedOutput(result.items, {
        page: pageNumber,
        pageSize,
        totalCount: result.totalCount,
      });

      res.status(HttpStatus.Ok_200).json(paginatedOutput);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  getComment = async (req: Request<{ commentId: string }>, res: Response): Promise<void> => {
    try {
      const comment = await this.commentsService.getCommentById(
        req.params.commentId,
        req.userId ?? null,
      );
      if (!comment) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }
      res.status(HttpStatus.Ok_200).json(comment);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  createCommentForPost = async (
    req: Request<{ postId: string }, {}, CommentInputModel>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.commentsService.createCommentForPost(
        req.params.postId,
        userId,
        req.body,
      );

      if (result.status !== ResultStatus.Success || !result.data) {
        res.sendStatus(resultCodeToHttpException(result.status));
        return;
      }

      res.status(HttpStatus.Created_201).json(mapToCommentViewModel(result.data));
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  updateComment = async (
    req: Request<{ commentId: string }, {}, CommentInputModel>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.commentsService.updateComment(userId, req.params.commentId, req.body);

      if (result.status !== ResultStatus.Success) {
        res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  deleteComment = async (req: Request<{ commentId: string }>, res: Response): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.commentsService.deleteComment(userId, req.params.commentId);

      if (result.status !== ResultStatus.Success) {
        res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  updateLikeStatus = async (
    req: Request<{ commentId: string }, {}, LikeInputModel>,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.userId as string;
      const result = await this.commentsService.updateLikeStatus(
        req.params.commentId,
        userId,
        req.body.likeStatus,
      );

      if (result.status !== ResultStatus.Success) {
        res.sendStatus(resultCodeToHttpException(result.status));
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}