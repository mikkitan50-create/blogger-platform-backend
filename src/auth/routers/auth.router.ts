import { Router } from 'express';
import { AUTH_ROUTES } from '../constants/auth.paths';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { loginInputDtoValidation } from '../validation/login-input-dto.validation';
import { loginHandler } from '../handlers/login.handler';

export const authRouter = Router({});

authRouter.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  inputValidationResultMiddleware,
  loginHandler,
);