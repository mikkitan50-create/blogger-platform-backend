import { WithId } from 'mongodb';
import { Comment, CommentViewModel } from '../types/comment';

export function mapToCommentViewModel(comment: WithId<Comment>): CommentViewModel {
  return {
    id: comment._id.toString(),
    content: comment.content,
    commentatorInfo: comment.commentatorInfo,
    createdAt: comment.createdAt.toISOString(),
  };
}