import { CommentDocument } from '../domain/comment.entity';
import { CommentViewModel } from '../types/comment';
import { LikeStatus } from '../types/comment-like';

export function mapToCommentViewModel(
  comment: CommentDocument,
  myStatus: LikeStatus = LikeStatus.None,
): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
    likesInfo: {
      likesCount: comment.likesCount,
      dislikesCount: comment.dislikesCount,
      myStatus,
    },
  };
}