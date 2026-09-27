import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { PostDocument, PostModel } from '../domain/post.entity';
import { PostsRepository } from '../repositories/posts.repository';
import { PostInputModel, PostQueryInput } from '../types/post';

type PostForBlogInputBody = {
  title: string;
  shortDescription: string;
  content: string;
};

@injectable()
export class PostsService {
  constructor(
    @inject(TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async getPostList(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    return this.postsRepository.findMany(queryDto);
  }

  async getPostsForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number } | null> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) return null;

    return this.postsRepository.findManyByBlogId(blogId, queryDto);
  }

  async getPostById(id: string): Promise<PostDocument | null> {
    return this.postsRepository.findById(id);
  }

  async createPost(dto: PostInputModel): Promise<PostDocument | null> {
    return this.createPostForBlog(dto.blogId, dto);
  }

  async createPostForBlog(
    blogId: string,
    dto: PostForBlogInputBody,
  ): Promise<PostDocument | null> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) return null;

    const post = new PostModel({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId,
      blogName: blog.name,
      createdAt: new Date(),
    });

    await this.postsRepository.save(post);
    return post;
  }

  async updatePost(id: string, dto: PostInputModel): Promise<boolean> {
    const post = await this.postsRepository.findById(id);
    if (!post) return false;

    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) return false;

    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = blog.name;

    await this.postsRepository.save(post);
    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.delete(id);
  }
}