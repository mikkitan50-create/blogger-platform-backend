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

  async findByEmail(email: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ email });
  },

  async findByConfirmationCode(code: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ 'emailConfirmation.confirmationCode': code });
  },

  async findByRecoveryCode(code: string): Promise<WithId<User> | null> {
    return userCollection.findOne({ 'passwordRecovery.recoveryCode': code });
  },

  async updateConfirmation(id: string): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return updateResult.modifiedCount > 0;
  },

  async updateConfirmationCode(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          'emailConfirmation.confirmationCode': code,
          'emailConfirmation.expirationDate': expirationDate,
        },
      },
    );
    return updateResult.modifiedCount > 0;
  },

  async setRecoveryCode(
    id: string,
    code: string,
    expirationDate: Date,
  ): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          passwordRecovery: { recoveryCode: code, expirationDate },
        },
      },
    );
    return updateResult.modifiedCount > 0;
  },

  async updatePassword(id: string, passwordHash: string): Promise<boolean> {
    const updateResult = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: { passwordHash },
        $unset: { passwordRecovery: '' },
      },
    );
    return updateResult.modifiedCount > 0;
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