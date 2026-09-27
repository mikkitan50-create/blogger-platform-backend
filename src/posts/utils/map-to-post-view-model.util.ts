import { PostDocument } from '../domain/post.entity';
import { PostViewModel } from '../types/post';

export function mapToPostViewModel(post: PostDocument): PostViewModel {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt.toISOString(),
  };
}