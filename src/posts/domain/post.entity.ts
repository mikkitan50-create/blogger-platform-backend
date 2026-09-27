import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { Post } from '../types/post';

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
});

export type PostDocument = HydratedDocument<Post>;
type PostModelType = Model<Post>;

export const PostModel = model<Post, PostModelType>('posts', postSchema);