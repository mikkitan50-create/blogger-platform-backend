import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';
import { BlogDocument, BlogModel } from '../domain/blog.entity';
import { Blog, BlogQueryInput } from '../types/blog';

@injectable()
export class BlogsRepository {
  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: BlogDocument[]; totalCount: number }> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryDto;

    const filter: QueryFilter<Blog> = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      BlogModel.find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize),
      BlogModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findById(id: string): Promise<BlogDocument | null> {
    return BlogModel.findById(id);
  }

  async save(blog: BlogDocument): Promise<void> {
    await blog.save();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await BlogModel.deleteOne({ _id: id });
    return deleteResult.deletedCount > 0;
  }
}

export const blogsRepository = new BlogsRepository();