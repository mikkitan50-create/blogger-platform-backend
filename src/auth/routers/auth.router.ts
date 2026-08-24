import { Router } from 'express';
import { AUTH_ROUTES } from '../constants/auth.paths';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { loginInputDtoValidation } from '../validation/login-input-dto.validation';
import { userInputDtoValidation } from '../../users/validation/user-input-dto.validation';
import { registrationConfirmationCodeValidation } from '../validation/registration-confirmation-code.validation';
import { registrationEmailResendingValidation } from '../validation/registration-email-resending.validation';
import { loginHandler } from '../handlers/login.handler';
import { getMeHandler } from '../handlers/get-me.handler';
import { registrationHandler } from '../handlers/registration.handler';
import { registrationConfirmationHandler } from '../handlers/registration-confirmation.handler';
import { registrationEmailResendingHandler } from '../handlers/registration-email-resending.handler';
import { accessTokenGuardMiddleware } from '../middlewares/access-token-guard.middleware';
import { refreshTokenGuardMiddleware } from '../middlewares/refresh-token-guard.middleware';
import { refreshTokenHandler } from '../handlers/refresh-token.handler';
import { logoutHandler } from '../handlers/logout.handler';

export const authRouter = Router({});

authRouter.post(
  AUTH_ROUTES.LOGIN,
  loginInputDtoValidation,
  inputValidationResultMiddleware,
  loginHandler,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  registrationHandler,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_CONFIRMATION,
  registrationConfirmationCodeValidation,
  inputValidationResultMiddleware,
  registrationConfirmationHandler,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_EMAIL_RESENDING,
  registrationEmailResendingValidation,
  inputValidationResultMiddleware,
  registrationEmailResendingHandler,
);

authRouter.get(
  AUTH_ROUTES.ME,
  accessTokenGuardMiddleware,
  getMeHandler,
);


authRouter.post(
  AUTH_ROUTES.REFRESH_TOKEN,
  refreshTokenGuardMiddleware,
  refreshTokenHandler,
);

authRouter.post(
  AUTH_ROUTES.LOGOUT,
  refreshTokenGuardMiddleware,
  logoutHandler,
);