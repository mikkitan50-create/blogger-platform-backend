import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { authService } from '../application/auth.service';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';

export async function logoutHandler(req: Request, res: Response) {
  try {
    const refreshToken = req.refreshToken as string;

    const result = await authService.logout(refreshToken);

    if (result.status !== 'Success') {
      res.sendStatus(resultCodeToHttpException(result.status));
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}