import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { commentsRepository } from '../repositories/comments.repository';
import { mapToCommentViewModel } from '../utils/map-to-comment-view-model.util';

export async function getCommentHandler(req: Request<{ commentId: string }>, res: Response) {
  try {
    const comment = await commentsRepository.findById(req.params.commentId);
    if (!comment) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }
    res.status(HttpStatus.Ok_200).json(mapToCommentViewModel(comment));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}