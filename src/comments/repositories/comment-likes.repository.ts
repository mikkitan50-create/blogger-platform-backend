import { injectable } from 'inversify';
import { CommentLikeDocument, CommentLikeModel } from '../domain/comment-like.entity';
import { LikeStatus } from '../types/comment-like';

@injectable()
export class CommentLikesRepository {
  async findByCommentAndUser(commentId: string, userId: string): Promise<CommentLikeDocument | null> {
    return CommentLikeModel.findOne({ commentId, userId });
  }

  async findManyByUserForComments(
    userId: string,
    commentIds: string[],
  ): Promise<CommentLikeDocument[]> {
    return CommentLikeModel.find({ userId, commentId: { $in: commentIds } });
  }

  async countByStatus(commentId: string, status: LikeStatus): Promise<number> {
    return CommentLikeModel.countDocuments({ commentId, status });
  }

  async save(like: CommentLikeDocument): Promise<void> {
    await like.save();
  }

  async delete(like: CommentLikeDocument): Promise<void> {
    await like.deleteOne();
  }

  async deleteAllForComment(commentId: string): Promise<void> {
    await CommentLikeModel.deleteMany({ commentId });
  }
}