import { API_PREFIX } from '../../core/constants/api.paths';

export const COMMENTS_PATH = `${API_PREFIX}/comments`;

export const COMMENTS_ROUTES = {
  BY_ID: '/:commentId',
} as const;