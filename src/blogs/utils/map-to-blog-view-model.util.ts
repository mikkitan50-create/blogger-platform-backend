import { BlogDocument } from '../domain/blog.entity';
import { BlogViewModel } from '../types/blog';

export function mapToBlogViewModel(blog: BlogDocument): BlogViewModel {
  return {
    id: blog._id.toString(),
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt.toISOString(),
    isMembership: blog.isMembership,
  };
}