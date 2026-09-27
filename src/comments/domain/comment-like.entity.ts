import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { CommentLike, LikeStatus } from '../types/comment-like';

const commentLikeSchema = new Schema<CommentLike>({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, enum: [LikeStatus.Like, LikeStatus.Dislike], required: true },
  createdAt: { type: Date, required: true },
});

commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

export type CommentLikeDocument = HydratedDocument<CommentLike>;
type CommentLikeModelType = Model<CommentLike>;

export const CommentLikeModel = model<CommentLike, CommentLikeModelType>('likes', commentLikeSchema);