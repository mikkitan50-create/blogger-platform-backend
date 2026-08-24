import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { authService } from '../application/auth.service';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const oldRefreshToken = req.refreshToken as string;

    const result = await authService.refreshTokenPair(oldRefreshToken);

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