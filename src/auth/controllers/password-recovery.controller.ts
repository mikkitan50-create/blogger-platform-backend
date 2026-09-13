import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { passwordRecoveryService, PasswordRecoveryService } from '../application/password-recovery.service';

type PasswordRecoveryBody = { email: string };
type NewPasswordBody = { newPassword: string; recoveryCode: string };

export class PasswordRecoveryController {
  constructor(private passwordRecoveryService: PasswordRecoveryService) {}

  passwordRecovery = async (
    req: Request<{}, {}, PasswordRecoveryBody>,
    res: Response,
  ): Promise<void> => {
    try {
      await this.passwordRecoveryService.requestPasswordRecovery(req.body.email);
      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  newPassword = async (
    req: Request<{}, {}, NewPasswordBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const { newPassword, recoveryCode } = req.body;
      const result = await this.passwordRecoveryService.confirmPasswordRecovery(
        newPassword,
        recoveryCode,
      );

      if (result.status !== ResultStatus.Success) {
        res.status(resultCodeToHttpException(result.status)).send({
          errorsMessages: result.extensions,
        });
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}

export const passwordRecoveryController = new PasswordRecoveryController(passwordRecoveryService);