import { ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { blogsRepository } from '../../blogs/repositories/blogs.repository';
import { Post, PostInputModel } from '../types/post';

export const postsRepository = {
  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  },

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(data: Omit<Post, 'blogName'>): Promise<WithId<Post> | null> {
    const blog = await blogsRepository.findById(data.blogId);
    if (!blog) return null;

    const newPost: Post = { ...data, blogName: blog.name };
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  },

  async update(id: string, data: PostInputModel): Promise<boolean> {
    const blog = await blogsRepository.findById(data.blogId);
    if (!blog) return false;

    const updateResult = await postCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: data.title,
          shortDescription: data.shortDescription,
          content: data.content,
          blogId: data.blogId,
          blogName: blog.name,
        },
      },
    );
    return updateResult.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  },
};