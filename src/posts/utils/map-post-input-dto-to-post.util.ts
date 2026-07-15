import { Post, PostInputModel } from '../types/post';

export function mapPostInputDtoToPost(
  dto: PostInputModel,
): Omit<Post, 'createdAt' | 'blogName'> {
  return {
    title: dto.title,
    shortDescription: dto.shortDescription,
    content: dto.content,
    blogId: dto.blogId,
  };
}