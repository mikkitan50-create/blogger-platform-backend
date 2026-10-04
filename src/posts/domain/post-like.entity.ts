import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { LikeStatus } from '../../comments/types/comment-like';
import { PostLike } from '../types/post-like';
import { CreatePostLikeDto } from './dto';

type PostLikeMethods = typeof postLikeMethods;
type PostLikeStatics = typeof postLikeStatics;

type PostLikeModel = Model<PostLike, {}, PostLikeMethods> & PostLikeStatics;

export type PostLikeDocument = HydratedDocument<PostLike, PostLikeMethods>;

const postLikeSchema = new mongoose.Schema<PostLike, PostLikeModel, PostLikeMethods>({
  postId: { type: String, required: true },
  userId: { type: String, required: true },
  login: { type: String, required: true },
  status: { type: String, enum: [LikeStatus.Like, LikeStatus.Dislike], required: true },
  addedAt: { type: Date, required: true },
});

postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

const postLikeMethods = {
  changeStatus(newStatus: LikeStatus) {
    const like = this as PostLikeDocument;

    if (newStatus === LikeStatus.Like) {
      like.addedAt = new Date();
    }

    like.status = newStatus;
  },
};

const postLikeStatics = {
  createLike(dto: CreatePostLikeDto) {
    const like = new PostLikeModel() as PostLikeDocument;
    like.postId = dto.postId;
    like.userId = dto.userId;
    like.login = dto.login;
    like.status = dto.status;
    like.addedAt = new Date();

    return like;
  },
};

postLikeSchema.methods = postLikeMethods;
postLikeSchema.statics = postLikeStatics;

export const PostLikeModel = model<PostLike, PostLikeModel>('postLikes', postLikeSchema, 'postLikes');