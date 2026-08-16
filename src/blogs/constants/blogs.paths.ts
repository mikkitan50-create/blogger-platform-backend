import { API_PREFIX } from '../../core/constants/api.paths';

export const BLOGS_PATH = `${API_PREFIX}/blogs`;

export const BLOGS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
  POSTS_BY_BLOG_ID: '/:blogId/posts',
} as const;