import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { commentsRepository } from '../repositories/comments.repository';
import { CommentInputModel } from '../types/comment';
import { Result, ResultStatus } from '../types/result.type';
import { resultCodeToHttpException } from '../utils/result-code-to-http-exception.util';

async function updateComment(
  userId: string,
  commentId: string,
  dto: CommentInputModel,
): Promise<Result> {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) {
    return {
      status: ResultStatus.NotFound,
      extensions: [{ field: null, message: 'comment not found' }],
      data: null,
    };
  }

  if (comment.commentatorInfo.userId !== userId) {
    return {
      status: ResultStatus.Forbidden,
      extensions: [{ field: null, message: 'you can only edit your own comment' }],
      data: null,
    };
  }

  await commentsRepository.update(commentId, dto);

  return {
    status: ResultStatus.Success,
    extensions: [],
    data: null,
  };
}

export async function updateCommentHandler(
  req: Request<{ commentId: string }, {}, CommentInputModel>,
  res: Response,
) {
  try {
    const userId = req.userId as string;
    const result = await updateComment(userId, req.params.commentId, req.body);

    if (result.status !== ResultStatus.Success) {
      res.status(resultCodeToHttpException(result.status)).send(result.extensions);
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}