import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../composition/types';
import { BlogsRepository } from '../repositories/blogs.repository';
import { Blog, BlogInputModel, BlogQueryInput } from '../types/blog';
import { mapBlogInputDtoToBlog } from '../utils/map-blog-input-dto-to-blog.util';

@injectable()
export class BlogsService {
  constructor(
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async getBlogList(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return this.blogsRepository.findMany(queryDto);
  }

  async getBlogById(id: string): Promise<WithId<Blog> | null> {
    return this.blogsRepository.findById(id);
  }

  async createBlog(dto: BlogInputModel): Promise<WithId<Blog>> {
    const newBlog: Blog = {
      ...mapBlogInputDtoToBlog(dto),
      createdAt: new Date(),
    };
    return this.blogsRepository.create(newBlog);
  }

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    return this.blogsRepository.update(id, dto);
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}