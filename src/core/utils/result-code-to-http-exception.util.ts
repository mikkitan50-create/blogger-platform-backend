import { HttpStatus } from '../types/http-statuses';
import { ResultStatus } from '../types/result.type';

export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
  switch (resultCode) {
    case ResultStatus.BadRequest:
      return HttpStatus.BadRequest_400;
    case ResultStatus.Forbidden:
      return HttpStatus.Forbidden_403;
    case ResultStatus.NotFound:
      return HttpStatus.NotFound_404;
    case ResultStatus.Unauthorized:
      return HttpStatus.Unauthorized_401;
    default:
      return HttpStatus.InternalServerError_500;
  }
};