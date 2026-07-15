import { Blog, BlogInputModel } from '../types/blog';

export function mapBlogInputDtoToBlog(dto: BlogInputModel): Omit<Blog, 'createdAt'> {
  return {
    name: dto.name,
    description: dto.description,
    websiteUrl: dto.websiteUrl,
    isMembership: false,
  };
}