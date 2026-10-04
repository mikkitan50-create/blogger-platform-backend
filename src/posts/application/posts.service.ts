import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { PostDocument, PostModel } from '../domain/post.entity';
import { PostLikeModel } from '../domain/post-like.entity';
import { PostsRepository } from '../repositories/posts.repository';
import { PostLikesRepository } from '../repositories/post-likes.repository';
import { PostInputModel, PostQueryInput, PostViewModel } from '../types/post';
import { LikeStatus } from '../../comments/types/comment-like';
import { mapToPostViewModel } from '../utils/map-to-post-view-model.util';
import { Result, ResultStatus } from '../../core/types/result.type';

type PostForBlogInputBody = {
  title: string;
  shortDescription: string;
  content: string;
};

@injectable()
export class PostsService {
  constructor(
    @inject(TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(TYPES.PostLikesRepository) private postLikesRepository: PostLikesRepository,
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getPostList(
    queryDto: PostQueryInput,
    currentUserId: string | null,
  ): Promise<{ items: PostViewModel[]; totalCount: number }> {
    const { items, totalCount } = await this.postsRepository.findMany(queryDto);

    return {
      items: await this.mapPostsWithLikes(items, currentUserId),
      totalCount,
    };
  }

  async getPostsForBlog(
    blogId: string,
    queryDto: PostQueryInput,
    currentUserId: string | null,
  ): Promise<{ items: PostViewModel[]; totalCount: number } | null> {
    const blog = await this.blogsRepository.findById(blogId);
    if (!blog) return null;

    const { items, totalCount } = await this.postsRepository.findManyByBlogId(blogId, queryDto);

    return {
      items: await this.mapPostsWithLikes(items, currentUserId),
      totalCount,
    };
  }

  async getPostById(id: string, currentUserId: string | null): Promise<PostViewModel | null> {
    const post = await this.postsRepository.findById(id);
    if (!post) return null;

    const [postWithLikes] = await this.mapPostsWithLikes([post], currentUserId);
    return postWithLikes;
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

    const post = PostModel.createPost({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);
    return post;
  }

  async updatePost(id: string, dto: PostInputModel): Promise<boolean> {
    const post = await this.postsRepository.findById(id);
    if (!post) return false;

    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) return false;

    post.update({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);
    return true;
  }

  async deletePost(id: string): Promise<boolean> {
    const isDeleted = await this.postsRepository.delete(id);
    if (isDeleted) {
      await this.postLikesRepository.deleteAllForPost(id);
    }
    return isDeleted;
  }

  async updateLikeStatus(postId: string, userId: string, newStatus: LikeStatus): Promise<Result> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: null, message: 'post not found' }],
        data: null,
      };
    }

    const like = await this.postLikesRepository.findByPostAndUser(postId, userId);
    const currentStatus = like ? like.status : LikeStatus.None;

    if (currentStatus === newStatus) {
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: null,
      };
    }

    if (newStatus === LikeStatus.None) {
      await this.postLikesRepository.delete(like!);
    } else if (like) {
      like.changeStatus(newStatus);
      await this.postLikesRepository.save(like);
    } else {
      const user = await this.usersRepository.findById(userId);
      if (!user) {
        return {
          status: ResultStatus.Unauthorized,
          extensions: [{ field: null, message: 'user not found' }],
          data: null,
        };
      }

      const newLike = PostLikeModel.createLike({
        postId,
        userId,
        login: user.login,
        status: newStatus,
      });
      await this.postLikesRepository.save(newLike);
    }

    const [likesCount, dislikesCount] = await Promise.all([
      this.postLikesRepository.countByStatus(postId, LikeStatus.Like),
      this.postLikesRepository.countByStatus(postId, LikeStatus.Dislike),
    ]);

    post.updateLikesCounters(likesCount, dislikesCount);
    await this.postsRepository.save(post);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  private async mapPostsWithLikes(
    posts: PostDocument[],
    currentUserId: string | null,
  ): Promise<PostViewModel[]> {
    const postIds = posts.map((post) => post._id.toString());

    const myStatuses = new Map<string, LikeStatus>();
    if (currentUserId && postIds.length > 0) {
      const myLikes = await this.postLikesRepository.findManyByUserForPosts(currentUserId, postIds);
      myLikes.forEach((like) => myStatuses.set(like.postId, like.status));
    }

    const newestLikesPerPost = await Promise.all(
      postIds.map((postId) => this.postLikesRepository.findNewestLikes(postId)),
    );

    return posts.map((post, index) =>
      mapToPostViewModel(post, myStatuses.get(postIds[index]), newestLikesPerPost[index]),
    );
  }
}