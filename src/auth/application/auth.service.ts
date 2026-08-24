import { randomUUID } from 'node:crypto';
import { usersRepository } from '../../users/repositories/users.repository';
import { generatePasswordHash, comparePassword } from '../../users/utils/password.util';
import { UserInputModel } from '../../users/types/user';
import { Result, ResultStatus } from '../../core/types/result.type';
import { nodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../utils/email-examples.util';
import { jwtService } from '../adapters/jwt.service';
import { revokedTokenRepository } from '../repositories/revoked-token.repository';

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

  async loginUser(
    loginOrEmail: string,
    password: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'login or password is wrong' }],
        data: null,
      };
    }

    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'login or password is wrong' }],
        data: null,
      };
    }

    const userId = user._id.toString();
    const accessToken = await jwtService.createAccessToken(userId);
    const refreshToken = await jwtService.createRefreshToken(userId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken, refreshToken },
    };
  },

  async refreshTokenPair(
    oldRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const payload = await jwtService.verifyToken(oldRefreshToken);
    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is invalid or expired' }],
        data: null,
      };
    }

    const isRevoked = await revokedTokenRepository.isRevoked(oldRefreshToken);
    if (isRevoked) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is revoked' }],
        data: null,
      };
    }

    await revokedTokenRepository.revoke(oldRefreshToken);

    const accessToken = await jwtService.createAccessToken(payload.userId);
    const refreshToken = await jwtService.createRefreshToken(payload.userId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken, refreshToken },
    };
  },

  async logout(refreshToken: string): Promise<Result> {
    const payload = await jwtService.verifyToken(refreshToken);
    if (!payload) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is invalid or expired' }],
        data: null,
      };
    }

    const isRevoked = await revokedTokenRepository.isRevoked(refreshToken);
    if (isRevoked) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is revoked' }],
        data: null,
      };
    }

    await revokedTokenRepository.revoke(refreshToken);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  },
};