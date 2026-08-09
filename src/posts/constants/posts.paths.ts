export const POSTS_PATH = '/hometask_06/api/posts';

export const POSTS_ROUTES = {
  ROOT: '',
  BY_ID: '/:id',
  COMMENTS_BY_POST_ID: '/:postId/comments',
} as const;