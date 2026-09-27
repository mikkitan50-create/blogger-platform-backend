import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { Comment, CommentatorInfo } from '../types/comment';

const commentatorInfoSchema = new Schema<CommentatorInfo>(
  {
    userId: { type: String, required: true },
    userLogin: { type: String, required: true },
  },
  { _id: false },
);

const commentSchema = new Schema<Comment>({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  commentatorInfo: { type: commentatorInfoSchema, required: true },
  createdAt: { type: Date, required: true },
});

export type CommentDocument = HydratedDocument<Comment>;
type CommentModelType = Model<Comment>;

export const CommentModel = model<Comment, CommentModelType>('comments', commentSchema);