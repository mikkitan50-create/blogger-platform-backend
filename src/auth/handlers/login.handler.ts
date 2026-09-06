import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { authService } from '../application/auth.service';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';

type LoginInputBody = {
  loginOrEmail: string;
  password: string;
};

export async function loginHandler(
  req: Request<{}, {}, LoginInputBody>,
  res: Response,
) {
  try {
    const { loginOrEmail, password } = req.body;

    const result = await authService.loginUser(
      loginOrEmail,
      password,
      req.ip || 'unknown',
      req.headers['user-agent'],
    );

    if (result.status !== 'Success' || !result.data) {
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
}