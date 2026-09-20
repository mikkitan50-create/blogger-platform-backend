import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { TYPES } from '../../composition/types';
import { UsersRepository } from '../../users/repositories/users.repository';
import { generatePasswordHash, comparePassword } from '../../users/utils/password.util';
import { User, UserInputModel } from '../../users/types/user';
import { Result, ResultStatus } from '../../core/types/result.type';
import { NodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../utils/email-examples.util';
import { JwtService } from '../adapters/jwt.service';
import { DeviceSessionsRepository } from '../../security-devices/repositories/device-sessions.repository';

const CONFIRMATION_CODE_LIFETIME_MS = 90 * 60 * 1000;
const DEFAULT_DEVICE_TITLE = 'unknown device';

function getTokenIatAndExp(token: string): { iat: Date; exp: Date } {
  const decoded = jwt.decode(token) as { iat: number; exp: number };
  return {
    iat: new Date(decoded.iat * 1000),
    exp: new Date(decoded.exp * 1000),
  };
}

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
    @inject(TYPES.JwtService) private jwtService: JwtService,
    @inject(TYPES.NodemailerService) private nodemailerService: NodemailerService,
    @inject(TYPES.DeviceSessionsRepository) private deviceSessionsRepository: DeviceSessionsRepository,
  ) {}

  async registerUser(dto: UserInputModel): Promise<Result> {
    const existingUserByLogin = await this.usersRepository.findByLoginOrEmail(dto.login);
    if (existingUserByLogin) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'login', message: 'login should be unique' }],
        data: null,
      };
    }

    const existingUserByEmail = await this.usersRepository.findByLoginOrEmail(dto.email);
    if (existingUserByEmail) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'email', message: 'email should be unique' }],
        data: null,
      };
    }

    const passwordHash = await generatePasswordHash(dto.password);
    const confirmationCode = randomUUID();

    const newUser: User = {
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode,
        expirationDate: new Date(Date.now() + CONFIRMATION_CODE_LIFETIME_MS),
        isConfirmed: false,
      },
      passwordRecovery: null,
    };

    await this.usersRepository.create(newUser);

    this.nodemailerService
      .sendEmail(dto.email, confirmationCode, emailExamples.registrationEmail)
      .catch((e) => console.error('Send email error', e));

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async confirmRegistration(code: string): Promise<Result> {
    const user = await this.usersRepository.findByConfirmationCode(code);
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

    await this.usersRepository.updateConfirmation(user._id.toString());

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async resendConfirmationEmail(email: string): Promise<Result> {
    const user = await this.usersRepository.findByEmail(email);
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

    await this.usersRepository.updateConfirmationCode(
      user._id.toString(),
      newConfirmationCode,
      newExpirationDate,
    );

    this.nodemailerService
      .sendEmail(email, newConfirmationCode, emailExamples.registrationEmail)
      .catch((e) => console.error('Send email error', e));

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async loginUser(
    loginOrEmail: string,
    password: string,
    ip: string,
    userAgent: string | undefined,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
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
    const deviceId = randomUUID();

    const accessToken = await this.jwtService.createAccessToken(userId);
    const refreshToken = await this.jwtService.createRefreshToken(userId, deviceId);

    const { iat, exp } = getTokenIatAndExp(refreshToken);

    await this.deviceSessionsRepository.create({
      userId,
      deviceId,
      ip,
      title: userAgent || DEFAULT_DEVICE_TITLE,
      iat,
      exp,
    });

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken, refreshToken },
    };
  }

  async refreshTokenPair(
    oldRefreshToken: string,
  ): Promise<Result<{ accessToken: string; refreshToken: string } | null>> {
    const payload = await this.jwtService.verifyToken(oldRefreshToken);
    if (!payload || !payload.deviceId) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is invalid or expired' }],
        data: null,
      };
    }

    const session = await this.deviceSessionsRepository.findByDeviceId(payload.deviceId);
    if (!session || session.iat.getTime() !== payload.iat.getTime()) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is revoked' }],
        data: null,
      };
    }

    const accessToken = await this.jwtService.createAccessToken(payload.userId);
    const refreshToken = await this.jwtService.createRefreshToken(payload.userId, payload.deviceId);

    const { iat: newIat, exp: newExp } = getTokenIatAndExp(refreshToken);

    await this.deviceSessionsRepository.updateIatAndExp(payload.deviceId, newIat, newExp);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: { accessToken, refreshToken },
    };
  }

  async logout(refreshToken: string): Promise<Result> {
    const payload = await this.jwtService.verifyToken(refreshToken);
    if (!payload || !payload.deviceId) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is invalid or expired' }],
        data: null,
      };
    }

    const session = await this.deviceSessionsRepository.findByDeviceId(payload.deviceId);
    if (!session || session.iat.getTime() !== payload.iat.getTime()) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [{ field: null, message: 'refresh token is revoked' }],
        data: null,
      };
    }

    await this.deviceSessionsRepository.deleteByDeviceId(payload.deviceId);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async getMe(userId: string): Promise<Result<{ email: string; login: string; userId: string } | null>> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return {
        status: ResultStatus.Unauthorized,
        extensions: [],
        data: null,
      };
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: {
        email: user.email,
        login: user.login,
        userId: user._id.toString(),
      },
    };
  }
}