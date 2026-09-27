import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { CommentDocument, CommentModel } from '../domain/comment.entity';
import { CommentLikeModel } from '../domain/comment-like.entity';
import { CommentsRepository } from '../repositories/comments.repository';
import { CommentLikesRepository } from '../repositories/comment-likes.repository';
import { PostsRepository } from '../../posts/repositories/posts.repository';
import { UsersRepository } from '../../users/repositories/users.repository';
import { CommentInputModel, CommentQueryInput, CommentViewModel } from '../types/comment';
import { LikeStatus } from '../types/comment-like';
import { mapToCommentViewModel } from '../utils/map-to-comment-view-model.util';
import { Result, ResultStatus } from '../../core/types/result.type';

@injectable()
export class CommentsService {
  constructor(
    @inject(TYPES.CommentsRepository) private commentsRepository: CommentsRepository,
    @inject(TYPES.CommentLikesRepository) private commentLikesRepository: CommentLikesRepository,
    @inject(TYPES.PostsRepository) private postsRepository: PostsRepository,
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getCommentsForPost(
    postId: string,
    queryDto: CommentQueryInput,
    currentUserId: string | null,
  ): Promise<{ items: CommentViewModel[]; totalCount: number } | null> {
    const post = await this.postsRepository.findById(postId);
    if (!post) return null;

    const { items, totalCount } = await this.commentsRepository.findManyByPostId(postId, queryDto);

    const myStatuses = new Map<string, LikeStatus>();
    if (currentUserId && items.length > 0) {
      const commentIds = items.map((comment) => comment._id.toString());
      const likes = await this.commentLikesRepository.findManyByUserForComments(currentUserId, commentIds);
      likes.forEach((like) => myStatuses.set(like.commentId, like.status));
    }

    return {
      items: items.map((comment) =>
        mapToCommentViewModel(comment, myStatuses.get(comment._id.toString())),
      ),
      totalCount,
    };
  }

  async getCommentById(id: string, currentUserId: string | null): Promise<CommentViewModel | null> {
    const comment = await this.commentsRepository.findById(id);
    if (!comment) return null;

    const myStatus = await this.getMyStatus(id, currentUserId);
    return mapToCommentViewModel(comment, myStatus);
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
    await this.commentLikesRepository.deleteAllForComment(commentId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async updateLikeStatus(
    commentId: string,
    userId: string,
    newStatus: LikeStatus,
  ): Promise<Result> {
    const comment = await this.commentsRepository.findById(commentId);
    if (!comment) {
      return {
        status: ResultStatus.NotFound,
        extensions: [{ field: null, message: 'comment not found' }],
        data: null,
      };
    }

    const like = await this.commentLikesRepository.findByCommentAndUser(commentId, userId);
    const currentStatus = like ? like.status : LikeStatus.None;

    if (currentStatus === newStatus) {
      return {
        status: ResultStatus.Success,
        extensions: [],
        data: null,
      };
    }

    if (newStatus === LikeStatus.None) {
      await this.commentLikesRepository.delete(like!);
    } else if (like) {
      like.status = newStatus;
      await this.commentLikesRepository.save(like);
    } else {
      const newLike = new CommentLikeModel({
        commentId,
        userId,
        status: newStatus,
        createdAt: new Date(),
      });
      await this.commentLikesRepository.save(newLike);
    }

    const [likesCount, dislikesCount] = await Promise.all([
      this.commentLikesRepository.countByStatus(commentId, LikeStatus.Like),
      this.commentLikesRepository.countByStatus(commentId, LikeStatus.Dislike),
    ]);

    comment.likesCount = likesCount;
    comment.dislikesCount = dislikesCount;
    await this.commentsRepository.save(comment);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  private async getMyStatus(commentId: string, currentUserId: string | null): Promise<LikeStatus> {
    if (!currentUserId) return LikeStatus.None;

    const like = await this.commentLikesRepository.findByCommentAndUser(commentId, currentUserId);
    return like ? like.status : LikeStatus.None;
  }
}