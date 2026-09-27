import { CommentDocument } from '../domain/comment.entity';
import { CommentViewModel } from '../types/comment';

export function mapToCommentViewModel(comment: CommentDocument): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
    },
    createdAt: comment.createdAt.toISOString(),
  };
}