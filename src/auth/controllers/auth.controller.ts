import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { TYPES } from '../../composition/types';
import { AuthService } from '../application/auth.service';
import { UserInputModel } from '../../users/types/user';

type LoginInputBody = { loginOrEmail: string; password: string };
type ConfirmationCodeBody = { code: string };
type EmailResendingBody = { email: string };

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: AuthService,
  ) {}

  login = async (req: Request<{}, {}, LoginInputBody>, res: Response): Promise<void> => {
    try {
      const { loginOrEmail, password } = req.body;

      const result = await this.authService.loginUser(
        loginOrEmail,
        password,
        req.ip || 'unknown',
        req.headers['user-agent'],
      );

      if (result.status !== ResultStatus.Success || !result.data) {
        res.sendStatus(resultCodeToHttpException(result.status));
        return;
      }

      const { accessToken, refreshToken } = result.data;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(HttpStatus.Ok_200).send({ accessToken });
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  registration = async (req: Request<{}, {}, UserInputModel>, res: Response): Promise<void> => {
    try {
      const result = await this.authService.registerUser(req.body);

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

  registrationConfirmation = async (
    req: Request<{}, {}, ConfirmationCodeBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.authService.confirmRegistration(req.body.code);

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

  registrationEmailResending = async (
    req: Request<{}, {}, EmailResendingBody>,
    res: Response,
  ): Promise<void> => {
    try {
      const result = await this.authService.resendConfirmationEmail(req.body.email);

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

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const oldRefreshToken = req.refreshToken as string;

      const result = await this.authService.refreshTokenPair(oldRefreshToken);

      if (result.status !== ResultStatus.Success || !result.data) {
        res.sendStatus(resultCodeToHttpException(result.status));
        return;
      }

      const { accessToken, refreshToken } = result.data;

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      });

      res.status(HttpStatus.Ok_200).send({ accessToken });
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.refreshToken as string;

      const result = await this.authService.logout(refreshToken);

      if (result.status !== ResultStatus.Success) {
        res.sendStatus(resultCodeToHttpException(result.status));
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.sendStatus(HttpStatus.Unauthorized_401);
        return;
      }

      const result = await this.authService.getMe(userId);

      if (result.status !== ResultStatus.Success || !result.data) {
        res.sendStatus(HttpStatus.Unauthorized_401);
        return;
      }

      res.status(HttpStatus.Ok_200).send(result.data);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}