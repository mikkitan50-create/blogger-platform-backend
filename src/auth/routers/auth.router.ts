import { Router } from 'express';
import { AUTH_ROUTES } from '../constants/auth.paths';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { loginInputDtoValidation } from '../validation/login-input-dto.validation';
import { userInputDtoValidation } from '../../users/validation/user-input-dto.validation';
import { registrationConfirmationCodeValidation } from '../validation/registration-confirmation-code.validation';
import { registrationEmailResendingValidation } from '../validation/registration-email-resending.validation';
import { passwordRecoveryInputDtoValidation } from '../validation/password-recovery-input-dto.validation';
import { newPasswordRecoveryInputDtoValidation } from '../validation/new-password-recovery-input-dto.validation';
import { accessTokenGuardMiddleware } from '../middlewares/access-token-guard.middleware';
import { refreshTokenGuardMiddleware } from '../middlewares/refresh-token-guard.middleware';
import { rateLimitMiddleware } from '../../rate-limit/middlewares/rate-limit.middleware';
import { container } from '../../composition/composition-root';
import { TYPES } from '../../composition/types';
import { AuthController } from '../controllers/auth.controller';
import { PasswordRecoveryController } from '../controllers/password-recovery.controller';

const authController = container.get<AuthController>(TYPES.AuthController);
const passwordRecoveryController = container.get<PasswordRecoveryController>(TYPES.PasswordRecoveryController);

export const authRouter = Router({});

authRouter.post(
  AUTH_ROUTES.LOGIN,
  rateLimitMiddleware,
  loginInputDtoValidation,
  inputValidationResultMiddleware,
  authController.login,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION,
  rateLimitMiddleware,
  userInputDtoValidation,
  inputValidationResultMiddleware,
  authController.registration,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_CONFIRMATION,
  rateLimitMiddleware,
  registrationConfirmationCodeValidation,
  inputValidationResultMiddleware,
  authController.registrationConfirmation,
);

authRouter.post(
  AUTH_ROUTES.REGISTRATION_EMAIL_RESENDING,
  rateLimitMiddleware,
  registrationEmailResendingValidation,
  inputValidationResultMiddleware,
  authController.registrationEmailResending,
);

authRouter.post(
  AUTH_ROUTES.PASSWORD_RECOVERY,
  rateLimitMiddleware,
  passwordRecoveryInputDtoValidation,
  inputValidationResultMiddleware,
  passwordRecoveryController.passwordRecovery,
);

authRouter.post(
  AUTH_ROUTES.NEW_PASSWORD,
  rateLimitMiddleware,
  newPasswordRecoveryInputDtoValidation,
  inputValidationResultMiddleware,
  passwordRecoveryController.newPassword,
);

authRouter.get(
  AUTH_ROUTES.ME,
  accessTokenGuardMiddleware,
  authController.getMe,
);

authRouter.post(
  AUTH_ROUTES.REFRESH_TOKEN,
  refreshTokenGuardMiddleware,
  authController.refreshToken,
);

authRouter.post(
  AUTH_ROUTES.LOGOUT,
  refreshTokenGuardMiddleware,
  authController.logout,
);