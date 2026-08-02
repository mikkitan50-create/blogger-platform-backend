import { WithId } from 'mongodb';
import { User, UserViewModel } from '../types/user';

export function mapToUserViewModel(user: WithId<User>): UserViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}