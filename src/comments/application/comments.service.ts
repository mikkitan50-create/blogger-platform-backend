import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { CommentDocument, CommentModel } from '../domain/comment.entity';
import { CommentsRepository } from '../repositories/comments.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommentInputModel, CommentQueryInput } from '../types/comment';
import { Result, ResultStatus } from '../../core/types/result.type';

@injectable()
export class CommentsService {
  constructor(
    @inject(TYPES.CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getCommentsForPost(
    postId: string,
    queryDto: CommentQueryInput,
  ): Promise<{ items: CommentDocument[]; totalCount: number } | null> {
    const post = await this.postsRepository.findById(postId);
    if (!post) return null;

    return this.commentsRepository.findManyByPostId(postId, queryDto);
  }

  async getCommentById(id: string): Promise<CommentDocument | null> {
    return this.commentsRepository.findById(id);
  }

  async createCommentForPost(
    postId: string,
    userId: string,
    dto: CommentInputModel,
  ): Promise<Result<CommentDocument | null>> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: null, message: 'post not found' }],
        data: null,
      };
    }

    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'user not found' }],
        data: null,
      };
    }

    const comment = new CommentModel({
      postId,
      content: dto.content,
      commentatorInfo: {
        userId: user._id.toString(),
        userLogin: user.login,
      },
      createdAt: new Date(),
    });

    await this.commentsRepository.save(comment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: comment,
    };
  }

  async updateComment(
    userId: string,
    commentId: string,
    dto: CommentInputModel,
  ): Promise<Result> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: null, message: 'comment not found' }],
        data: null,
      };
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [{ field: null, message: 'you can only edit your own comment' }],
        data: null,
      };
    }

    comment.content = dto.content;
    await this.commentsRepository.save(comment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async deleteComment(userId: string, commentId: string): Promise<Result> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: null, message: 'comment not found' }],
        data: null,
      };
    }

    if (comment.commentatorInfo.userId !== userId) {
      return {
        status: ResultStatus.Forbidden,
        extensions: [{ field: null, message: 'you can only delete your own comment' }],
        data: null,
      };
    }

    await this.commentsRepository.delete(commentId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
}