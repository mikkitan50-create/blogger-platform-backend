import { API_PREFIX } from '../../core/constants/api.paths';

export const USERS_PATH = `${API_PREFIX}/users`;

export const USERS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
} as const;