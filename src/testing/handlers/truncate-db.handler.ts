import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { BlogModel } from '../../blogs/domain/blog.entity';
import { PostModel } from '../../posts/domain/post.entity';
import { UserModel } from '../../users/domain/user.entity';
import { CommentModel } from '../../comments/domain/comment.entity';
import { CommentLikeModel } from '../../comments/domain/comment-like.entity';
import { DeviceSessionModel } from '../../security-devices/domain/device-session.entity';
import { RequestLogModel } from '../../rate-limit/domain/request-log.entity';

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    await Promise.all([
      BlogModel.deleteMany({}),
      PostModel.deleteMany({}),
      UserModel.deleteMany({}),
      CommentModel.deleteMany({}),
      CommentLikeModel.deleteMany({}),
      DeviceSessionModel.deleteMany({}),
      RequestLogModel.deleteMany({}),
    ]);
    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}