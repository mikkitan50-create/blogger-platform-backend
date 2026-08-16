import { randomUUID } from 'node:crypto';
import { usersRepository } from '../../users/repositories/users.repository';
import { generatePasswordHash } from '../../users/utils/password.util';
import { UserInputModel } from '../../users/types/user';
import { Result, ResultStatus } from '../../core/types/result.type';
import { nodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../utils/email-examples.util';

const CONFIRMATION_CODE_LIFETIME_MS = 90 * 60 * 1000;

export const authService = {
  async registerUser(dto: UserInputModel): Promise<Result> {
    const existingUserByLogin = await usersRepository.findByLoginOrEmail(dto.login);
    if (existingUserByLogin) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'login', message: 'login should be unique' }],
        data: null,
      };
    }

    const existingUserByEmail = await usersRepository.findByLoginOrEmail(dto.email);
    if (existingUserByEmail) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email should be unique' }],
        data: null,
      };
    }

    const passwordHash = await generatePasswordHash(dto.password);
    const confirmationCode = randomUUID();

    const newUser = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode,
        expirationDate: new Date(Date.now() + CONFIRMATION_CODE_LIFETIME_MS),
        isConfirmed: false,
      },
    };

    await usersRepository.create(newUser);

    try {
      await nodemailerService.sendEmail(
        dto.email,
        confirmationCode,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.error('Send email error', e);
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },

  async confirmRegistration(code: string): Promise<Result> {
    const user = await usersRepository.findByConfirmationCode(code);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'confirmation code is incorrect' }],
        data: null,
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'email is already confirmed' }],
        data: null,
      };
    }

    if (user.emailConfirmation.expirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'code', message: 'confirmation code is expired' }],
        data: null,
      };
    }

    await usersRepository.updateConfirmation(user._id.toString());

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },

  async resendConfirmationEmail(email: string): Promise<Result> {
    const user = await usersRepository.findByEmail(email);
    if (!user) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'user with this email not found' }],
        data: null,
      };
    }

    if (user.emailConfirmation.isConfirmed) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email is already confirmed' }],
        data: null,
      };
    }

    const newConfirmationCode = randomUUID();
    const newExpirationDate = new Date(Date.now() + CONFIRMATION_CODE_LIFETIME_MS);

    await usersRepository.updateConfirmationCode(
      user._id.toString(),
      newConfirmationCode,
      newExpirationDate,
    );

 try {
      await nodemailerService.sendEmail(
        email,
        newConfirmationCode,
        emailExamples.registrationEmail,
      );
    } catch (e) {
      console.error('Send email error', e);
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },
};