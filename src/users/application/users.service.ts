import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { WithId } from 'mongodb';
import { TYPES } from '../../composition/types';
import { UsersRepository } from '../repositories/users.repository';
import { generatePasswordHash } from '../utils/password.util';
import { User, UserInputModel, UserQueryInput, UserViewModel } from '../types/user';
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
  ): Promise<{ items: WithId<User>[]; totalCount: number }> {
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

    const newUser: User = {
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
    };

    const createdUser = await this.usersRepository.create(newUser);

    return { status: 'success', user: mapToUserViewModel(createdUser) };
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}