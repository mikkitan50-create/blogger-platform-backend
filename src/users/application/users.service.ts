import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { UserDocument, UserModel } from '../domain/user.entity';
import { UsersRepository } from '../repositories/users.repository';
import { generatePasswordHash } from '../utils/password.util';
import { UserInputModel, UserQueryInput, UserViewModel } from '../types/user';
import { mapToUserViewModel } from '../utils/map-to-user-view-model.util';

export type CreateUserResult =
  | { status: 'success'; user: UserViewModel }
  | { status: 'error'; field: 'login' | 'email'; message: string };

@injectable()
export class UsersService {
  constructor(
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
  ) {}

  async getUserList(
    queryDto: UserQueryInput,
  ): Promise<{ items: UserDocument[]; totalCount: number }> {
    return this.usersRepository.findMany(queryDto);
  }

  async createUser(data: UserInputModel): Promise<CreateUserResult> {
    const existingUserByLogin = await this.usersRepository.findByLoginOrEmail(data.login);
    if (existingUserByLogin) {
      return { status: 'error', field: 'login', message: 'login should be unique' };
    }

    const existingUserByEmail = await this.usersRepository.findByLoginOrEmail(data.email);
    if (existingUserByEmail) {
      return { status: 'error', field: 'email', message: 'email should be unique' };
    }

    const passwordHash = await generatePasswordHash(data.password);

    const user = new UserModel({
      login: data.login,
      email: data.email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date(Date.now() + 90 * 60 * 1000),
        isConfirmed: true,
      },
      passwordRecovery: null,
    });

    await this.usersRepository.save(user);

    return { status: 'success', user: mapToUserViewModel(user) };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}