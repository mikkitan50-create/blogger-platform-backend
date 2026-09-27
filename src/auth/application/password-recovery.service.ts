import { randomUUID } from 'node:crypto';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../composition/types';
import { UsersRepository } from '../../users/repositories/users.repository';
import { generatePasswordHash } from '../../users/utils/password.util';
import { NodemailerService } from '../adapters/nodemailer.service';
import { emailExamples } from '../utils/email-examples.util';
import { Result, ResultStatus } from '../../core/types/result.type';

const RECOVERY_CODE_LIFETIME_MS = 60 * 60 * 1000;

@injectable()
export class PasswordRecoveryService {
  constructor(
    @inject(TYPES.UsersRepository) private usersRepository: UsersRepository,
    @inject(TYPES.NodemailerService) private nodemailerService: NodemailerService,
  ) {}

  async requestPasswordRecovery(email: string): Promise<Result> {
    const user = await this.usersRepository.findByEmail(email);

    if (user) {
      const recoveryCode = randomUUID();

      user.passwordRecovery = {
        recoveryCode,
        expirationDate: new Date(Date.now() + RECOVERY_CODE_LIFETIME_MS),
      };
      await this.usersRepository.save(user);

      this.nodemailerService
        .sendEmail(email, recoveryCode, emailExamples.passwordRecoveryEmail, 'Password recovery')
        .catch((e) => console.error('Send email error', e));
    }

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }

  async confirmPasswordRecovery(newPassword: string, recoveryCode: string): Promise<Result> {
    const user = await this.usersRepository.findByRecoveryCode(recoveryCode);

    if (!user || !user.passwordRecovery) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'recoveryCode', message: 'recovery code is incorrect' }],
        data: null,
      };
    }

    if (user.passwordRecovery.expirationDate < new Date()) {
      return {
        status: ResultStatus.BadRequest,
        extensions: [{ field: 'recoveryCode', message: 'recovery code is expired' }],
        data: null,
      };
    }

    user.passwordHash = await generatePasswordHash(newPassword);
    user.passwordRecovery = null;
    await this.usersRepository.save(user);

    return {
      status: ResultStatus.Success,
      extensions: [],
      data: null,
    };
  }
}