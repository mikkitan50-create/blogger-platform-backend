import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { BlogDocument, BlogModel } from '../domain/blog.entity';
import { BlogsRepository } from '../repositories/blogs.repository';
import { BlogInputModel, BlogQueryInput } from '../types/blog';
import { mapBlogInputDtoToBlog } from '../utils/map-blog-input-dto-to-blog.util';

@injectable()
export class BlogsService {
  constructor(
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async getBlogList(
    queryDto: BlogQueryInput,
  ): Promise<{ items: BlogDocument[]; totalCount: number }> {
    return this.blogsRepository.findMany(queryDto);
  }

  async getBlogById(id: string): Promise<BlogDocument | null> {
    return this.blogsRepository.findById(id);
  }

  async createBlog(dto: BlogInputModel): Promise<BlogDocument> {
    const blog = new BlogModel({
      ...mapBlogInputDtoToBlog(dto),
      createdAt: new Date(),
    });
    await this.blogsRepository.save(blog);
    return blog;
  }

  async updateBlog(id: string, dto: BlogInputModel): Promise<boolean> {
    const blog = await this.blogsRepository.findById(id);
    if (!blog) return false;

    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;

    await this.blogsRepository.save(blog);
    return true;
  }

  async deleteBlog(id: string): Promise<boolean> {
    return this.blogsRepository.delete(id);
  }
}