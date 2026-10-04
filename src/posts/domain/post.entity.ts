import mongoose, { HydratedDocument, model, Model } from 'mongoose';
import { Post } from '../types/post';
import { CreatePostDto, UpdatePostDto } from './dto';

type PostMethods = typeof postMethods;
type PostStatics = typeof postStatics;

type PostModel = Model<Post, {}, PostMethods> & PostStatics;

export type PostDocument = HydratedDocument<Post, PostMethods>;

const postSchema = new mongoose.Schema<Post, PostModel, PostMethods>({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  blogId: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: Date, required: true },
  likesCount: { type: Number, required: true, min: 0, default: 0 },
  dislikesCount: { type: Number, required: true, min: 0, default: 0 },
});

const postMethods = {
  update(dto: UpdatePostDto) {
    const post = this as PostDocument;
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
  },

  updateLikesCounters(likesCount: number, dislikesCount: number) {
    const post = this as PostDocument;
    post.likesCount = likesCount;
    post.dislikesCount = dislikesCount;
  },
};

const postStatics = {
  createPost(dto: CreatePostDto) {
    const post = new PostModel() as PostDocument;
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.createdAt = new Date();
    post.likesCount = 0;
    post.dislikesCount = 0;

    return post;
  },
};

postSchema.methods = postMethods;
postSchema.statics = postStatics;

export const PostModel = model<Post, PostModel>('posts', postSchema);