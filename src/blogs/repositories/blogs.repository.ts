import { Filter, ObjectId, WithId } from 'mongodb';
import { blogCollection } from '../../db/collections';
import { Blog, BlogInputModel, BlogQueryInput } from '../types/blog';

export class BlogsRepository {
  async findAll(): Promise<WithId<Blog>[]> {
    return blogCollection.find().toArray();
  }

  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryDto;

    const filter: Filter<Blog> = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const skip = (pageNumber - 1) * pageSize;

    const items = await blogCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogCollection.countDocuments(filter);

    return { items, totalCount };
  }

  async findById(id: string): Promise<WithId<Blog> | null> {
    return blogCollection.findOne({ _id: new ObjectId(id) });
  }

  async create(newBlog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogCollection.insertOne(newBlog);
    return { ...newBlog, _id: insertResult.insertedId };
  }

  async update(id: string, data: BlogInputModel): Promise<boolean> {
    const updateResult = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data },
    );
    return updateResult.matchedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  }
}

export const blogsRepository = new BlogsRepository();