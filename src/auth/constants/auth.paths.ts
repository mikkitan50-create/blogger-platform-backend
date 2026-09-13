import { API_PREFIX } from '../../core/constants/api.paths';

export const AUTH_PATH = `${API_PREFIX}/auth`;

export const AUTH_ROUTES = {
  LOGIN: '/login',
  ME: '/me',
  REGISTRATION: '/registration',
  REGISTRATION_CONFIRMATION: '/registration-confirmation',
  REGISTRATION_EMAIL_RESENDING: '/registration-email-resending',
  REFRESH_TOKEN: '/refresh-token',
  LOGOUT: '/logout',
  PASSWORD_RECOVERY: '/password-recovery',
  NEW_PASSWORD: '/new-password',
} as const;