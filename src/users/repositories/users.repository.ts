import { injectable } from 'inversify';
import { QueryFilter } from 'mongoose';
import { UserDocument, UserModel } from '../domain/user.entity';
import { User, UserQueryInput } from '../types/user';

@injectable()
export class UsersRepository {
  async findMany(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserDocument[]; totalCount: number }> {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = queryDto;

    const filter: QueryFilter<User> = {};
    const searchConditions: QueryFilter<User>[] = [];

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

    const [items, totalCount] = await Promise.all([
      UserModel.find(filter)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(pageSize),
      UserModel.countDocuments(filter),
    ]);

    return { items, totalCount };
  }

  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
    return UserModel.findOne({
      $or: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email });
  }

  async findByConfirmationCode(code: string): Promise<UserDocument | null> {
    return UserModel.findOne({ 'emailConfirmation.confirmationCode': code });
  }

  async findByRecoveryCode(code: string): Promise<UserDocument | null> {
    return UserModel.findOne({ 'passwordRecovery.recoveryCode': code });
  }

  async save(user: UserDocument): Promise<void> {
    await user.save();
  }

  async delete(id: string): Promise<boolean> {
    const deleteResult = await UserModel.deleteOne({ _id: id });
    return deleteResult.deletedCount > 0;
  }
}

export const usersRepository = new UsersRepository();