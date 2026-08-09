import { ObjectId, WithId } from 'mongodb';
import { commentCollection } from '../../db/collections';
import { Comment, CommentInputModel, CommentQueryInput } from '../types/comment';

export const commentsRepository = {
  async findManyByPostId(
    postId: string,
    queryDto: CommentQueryInput,
  ): Promise<{ items: WithId<Comment>[]; totalCount: number }> {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryDto;
    const filter = { postId };
    const skip = (pageNumber - 1) * pageSize;

    const items = await commentCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await commentCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findById(id: string): Promise<WithId<Comment> | null> {
    return commentCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newComment: Comment): Promise<WithId<Comment>> {
    const insertResult = await commentCollection.insertOne(newComment);
    return { ...newComment, _id: insertResult.insertedId };
  },

  async update(id: string, data: CommentInputModel): Promise<boolean> {
    const updateResult = await commentCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { content: data.content } },
    );
    return updateResult.matchedCount > 0;
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await commentCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  },
};