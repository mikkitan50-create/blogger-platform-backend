import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { HttpStatus } from '../../types/http-statuses';

const formatErrors = (error: ValidationError) => {
  if (error.type === 'field') {
    return { field: error.path, message: error.msg };
  }
  return { field: '', message: error.msg };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true }); // <-- вот здесь одна точка контроля

  if (errors.length > 0) {
    res.status(HttpStatus.BadRequest_400).json({ errorsMessages: errors });
    return;
  }

  next();
};