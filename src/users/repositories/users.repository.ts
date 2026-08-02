import { Filter, ObjectId, WithId } from 'mongodb';
import { userCollection } from '../../db/collections';
import { User, UserQueryInput } from '../types/user';

export const usersRepository = {
  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = queryDto;

    const filter: Filter<User> = {};
    const searchConditions = [];

    if (searchLoginTerm) {
      searchConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
    }
    if (searchEmailTerm) {
      searchConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
    }
    if (searchConditions.length > 0) {
      filter.$or = searchConditions;
    }

    const skip = (pageNumber - 1) * pageSize;

    const items = await userCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await userCollection.countDocuments(filter);

    return { items, totalCount };
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User> | null> {
    return userCollection.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  },

  async findById(id: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ _id: new ObjectId(id) });
  },

  async create(newUser: User): Promise<WithId<User>> {
    const insertResult = await userCollection.insertOne(newUser);
    return { ...newUser, _id: insertResult.insertedId };
  },

  async delete(id: string): Promise<boolean> {
    const deleteResult = await userCollection.deleteOne({ _id: new ObjectId(id) });
    return deleteResult.deletedCount > 0;
  },
};