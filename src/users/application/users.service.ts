import { usersRepository } from '../repositories/users.repository';
import { generatePasswordHash } from '../utils/password.util';
import { UserInputModel, UserViewModel } from '../types/user';
import { mapToUserViewModel } from '../utils/map-to-user-view-model.util';

export type CreateUserResult =
  | { status: 'success'; user: UserViewModel }
  | { status: 'error'; field: 'login' | 'email'; message: string };

export const usersService = {
  async createUser(data: UserInputModel): Promise<CreateUserResult> {
    const existingUserByLogin = await usersRepository.findByLoginOrEmail(data.login);
    if (existingUserByLogin) {
      return { status: 'error', field: 'login', message: 'login should be unique' };
    }

    const existingUserByEmail = await usersRepository.findByLoginOrEmail(data.email);
    if (existingUserByEmail) {
      return { status: 'error', field: 'email', message: 'email should be unique' };
    }

    const passwordHash = await generatePasswordHash(data.password);

    const newUser = {
      login: data.login,
      email: data.email,
      passwordHash,
      createdAt: new Date(),
    };

    const createdUser = await usersRepository.create(newUser);

    return { status: 'success', user: mapToUserViewModel(createdUser) };
  },
};