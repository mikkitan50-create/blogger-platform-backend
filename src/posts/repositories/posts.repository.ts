import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';
import { PostDocument, PostModel } from '../domain/post.entity';
import { Post, PostQueryInput } from '../types/post';

@injectable()
export class PostsRepository {
  async findMany(
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    return this._findManyByFilter({}, queryDto);
  }

  async findManyByBlogId(
    blogId: string,
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    return this._findManyByFilter({ blogId }, queryDto);
  }

  private async _findManyByFilter(
    filter: QueryFilter<Post>,
    queryDto: PostQueryInput,
  ): Promise<{ items: PostDocument[]; totalCount: number }> {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      PostModel.find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize),
      PostModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findById(id: string): Promise<PostDocument | null> {
    return PostModel.findById(id);
  }

  async save(post: PostDocument): Promise<void> {
    await post.save();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await PostModel.deleteOne({ _id: id });
    return deleteResult.deletedCount > 0;
  }
}