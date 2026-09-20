import { inject, injectable } from 'inversify';
import { Filter, ObjectId, WithId } from 'mongodb';
import { postCollection } from '../../db/collections';
import { TYPES } from '../../composition/types';
import { BlogsRepository } from '../../blogs/repositories/blogs.repository';
import { Post, PostInputModel, PostQueryInput } from '../types/post';

@injectable()
export class PostsRepository {
  constructor(
    @inject(TYPES.BlogsRepository) private blogsRepository: BlogsRepository,
  ) {}

  async findAll(): Promise<WithId<Post>[]> {
    return postCollection.find().toArray();
  }

  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return this._findManyByFilter({}, queryDto);
  }

  async findManyByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    return this._findManyByFilter({ blogId }, queryDto);
  }

  private async _findManyByFilter(
    filter: Filter<Post>,
    queryDto: PostQueryInput,
  ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
    const skip = (pageNumber - 1) * pageSize;

    const items = await postCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await postCollection.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<Post> | null> {
    return postCollection.findOne({ _id: new ObjectId(id) });
  }

  async create(data: Omit<Post, 'blogName'>): Promise<WithId<Post> | null> {
    const blog = await this.blogsRepository.findById(data.blogId);
    if (!blog) return null;

    const newPost: Post = { ...data, blogName: blog.name };
    const insertResult = await postCollection.insertOne(newPost);
    return { ...newPost, _id: insertResult.insertedId };
  }

  async update(id: string, data: PostInputModel): Promise<boolean> {
    const blog = await this.blogsRepository.findById(data.blogId);
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
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await postCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  }
}