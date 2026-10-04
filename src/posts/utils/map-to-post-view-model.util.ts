import { PostDocument } from '../domain/post.entity';
import { PostLikeDocument } from '../domain/post-like.entity';
import { PostViewModel } from '../types/post';
import { LikeStatus } from '../../comments/types/comment-like';

export function mapToPostViewModel(
  post: PostDocument,
  myStatus: LikeStatus = LikeStatus.None,
  newestLikes: PostLikeDocument[] = [],
): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
    extendedLikesInfo: {
      likesCount: post.likesCount,
      dislikesCount: post.dislikesCount,
      myStatus,
      newestLikes: newestLikes.map((like) => ({
        addedAt: like.addedAt.toISOString(),
        userId: like.userId,
        login: like.login,
      })),
    },
  };
}