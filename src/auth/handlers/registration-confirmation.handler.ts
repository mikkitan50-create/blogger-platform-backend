import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { authService } from '../application/auth.service';

type ConfirmationCodeBody = {
  code: string;
};

export async function registrationConfirmationHandler(
  req: Request<{}, {}, ConfirmationCodeBody>,
  res: Response,
) {
  try {
    const result = await authService.confirmRegistration(req.body.code);

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