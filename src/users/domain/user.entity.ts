import { HydratedDocument, model, Model, Schema } from 'mongoose';
import { EmailConfirmation, PasswordRecovery, User } from '../types/user';

const emailConfirmationSchema = new Schema<EmailConfirmation>(
  {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  { _id: false },
);

const passwordRecoverySchema = new Schema<NonNullable<PasswordRecovery>>(
  {
    recoveryCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
  },
  { _id: false },
);

const userSchema = new Schema<User>({
  login: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, required: true },
  emailConfirmation: { type: emailConfirmationSchema, required: true },
  passwordRecovery: { type: passwordRecoverySchema, default: null },
});

export type UserDocument = HydratedDocument<User>;
type UserModelType = Model<User>;

export const UserModel = model<User, UserModelType>('users', userSchema);