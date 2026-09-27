import { UserDocument } from '../domain/user.entity';
import { UserViewModel } from '../types/user';

export function mapToUserViewModel(user: UserDocument): UserViewModel {
  return {
    id: user._id.toString(),
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
}