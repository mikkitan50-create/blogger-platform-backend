import { injectable } from 'inversify';
import { CommentDocument, CommentModel } from '../domain/comment.entity';
import { CommentQueryInput } from '../types/comment';

@injectable()
export class CommentsRepository {
  async findManyByPostId(
    postId: string,
    queryDto: CommentQueryInput,
  ): Promise<{ items: CommentDocument[]; totalCount: number }> {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
    const filter = { postId };
    const skip = (pageNumber - 1) * pageSize;

    const [items, totalCount] = await Promise.all([
      CommentModel.find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize),
      CommentModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findById(id: string): Promise<CommentDocument | null> {
    return CommentModel.findById(id);
  }

  async save(comment: CommentDocument): Promise<void> {
    await comment.save();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await CommentModel.deleteOne({ _id: id });
    return deleteResult.deletedCount > 0;
  }
}