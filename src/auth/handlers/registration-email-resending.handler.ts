import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { ResultStatus } from '../../core/types/result.type';
import { resultCodeToHttpException } from '../../core/utils/result-code-to-http-exception.util';
import { authService } from '../application/auth.service';

type EmailResendingBody = {
  email: string;
};

export async function registrationEmailResendingHandler(
  req: Request<{}, {}, EmailResendingBody>,
  res: Response,
) {
  try {
    const result = await authService.resendConfirmationEmail(req.body.email);

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