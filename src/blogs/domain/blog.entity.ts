import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { Blog } from '../types/blog';

const blogSchema = new Schema<Blog>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isMembership: { type: Boolean, required: true, default: false },
});

export type BlogDocument = HydratedDocument<Blog>;
type BlogModelType = Model<Blog>;

export const BlogModel = model<Blog, BlogModelType>('blogs', blogSchema);