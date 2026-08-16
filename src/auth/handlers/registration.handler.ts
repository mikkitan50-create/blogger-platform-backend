import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { authService } from '../application/auth.service';
import { UserInputModel } from '../../users/types/user';

export async function registrationHandler(
  req: Request<{}, {}, UserInputModel>,
  res: Response,
) {
  try {
    const result = await authService.registerUser(req.body);

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
}