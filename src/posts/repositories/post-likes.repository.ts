import { injectable } from 'inversify';
import { PostLikeDocument, PostLikeModel } from '../domain/post-like.entity';
import { LikeStatus } from '../../comments/types/comment-like';

const NEWEST_LIKES_COUNT = 3;

@injectable()
export class PostLikesRepository {
  async findByPostAndUser(postId: string, userId: string): Promise<PostLikeDocument | null> {
    return PostLikeModel.findOne({ postId, userId });
  }

  async findManyByUserForPosts(userId: string, postIds: string[]): Promise<PostLikeDocument[]> {
    return PostLikeModel.find({ userId, postId: { $in: postIds } });
  }

  async findNewestLikes(postId: string): Promise<PostLikeDocument[]> {
    return PostLikeModel.find({ postId, status: LikeStatus.Like })
      .sort({ addedAt: -1 })
      .limit(NEWEST_LIKES_COUNT);
  }

  async countByStatus(postId: string, status: LikeStatus): Promise<number> {
    return PostLikeModel.countDocuments({ postId, status });
  }

  async save(like: PostLikeDocument): Promise<void> {
    await like.save();
  }

  async delete(like: PostLikeDocument): Promise<void> {
    await like.deleteOne();
  }

  async deleteAllForPost(postId: string): Promise<void> {
    await PostLikeModel.deleteMany({ postId });
  }
}