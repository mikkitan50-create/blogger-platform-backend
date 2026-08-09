import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { postsRepository } from '../../posts/repositories/posts.repository';
import { usersRepository } from '../../users/repositories/users.repository';
import { commentsRepository } from '../repositories/comments.repository';
import { mapToCommentViewModel } from '../utils/map-to-comment-view-model.util';
import { CommentInputModel } from '../types/comment';

export async function createCommentForPostHandler(
  req: Request<{ postId: string }, {}, CommentInputModel>,
  res: Response,
) {
  try {
    const postId = req.params.postId;

    const post = await postsRepository.findById(postId);
    if (!post) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    const userId = req.userId as string;
    const user = await usersRepository.findById(userId);
    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized_401);
      return;
    }

    const newComment = {
      postId,
      content: req.body.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: new Date(),
    };

    const createdComment = await commentsRepository.create(newComment);

    res.status(HttpStatus.Created_201).json(mapToCommentViewModel(createdComment));
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}