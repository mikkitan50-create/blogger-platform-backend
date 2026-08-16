import { API_PREFIX } from '../../core/constants/api.paths';

export const POSTS_PATH = `${API_PREFIX}/posts`;

export const POSTS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
  COMMENTS_BY_POST_ID: '/:postId/comments',
} as const;