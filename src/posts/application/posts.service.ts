import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../composition/types';
import { PostsRepository } from '../repositories/posts.repository';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { Post, PostInputModel, PostQueryInput } from '../types/post';
import { mapPostInputDtoToPost } from '../utils/map-post-input-dto-to-post.util';

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
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return this.postsRepository.findMany(queryDto);
  }

  async getPostsForBlog(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number } | null> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) return null;

    return this.postsRepository.findManyByBlogId(blogId, queryDto);
  }

  async getPostById(id: string): Promise<WithId<Post> | null> {
    return this.postsRepository.findById(id);
  }

  async createPost(dto: PostInputModel): Promise<WithId<Post> | null> {
    const newPostData = {
      ...mapPostInputDtoToPost(dto),
      createdAt: new Date(),
    };
    return this.postsRepository.create(newPostData);
  }

  async createPostForBlog(
    blogId: string,
    dto: PostForBlogInputBody,
  ): Promise<WithId<Post> | null> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) return null;

    const newPostData = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId,
      createdAt: new Date(),
    };

    return this.postsRepository.create(newPostData);
  }

  async updatePost(id: string, dto: PostInputModel): Promise<boolean> {
    return this.postsRepository.update(id, dto);
  }

  async deletePost(id: string): Promise<boolean> {
    return this.postsRepository.delete(id);
  }
}