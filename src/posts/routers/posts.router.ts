import { Router } from 'express';
import { POSTS_ROUTES } from '../constants/posts.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { postIdParamValidation } from '../../core/middlewares/validation/post-id-param.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access-token-guard.middleware';
import { postInputDtoValidation } from '../validation/post-input-dto.validation';
import { commentInputDtoValidation } from '../../comments/validation/comment-input-dto.validation';
import { PostSortField } from '../types/post-sort-field';
import { CommentSortField } from '../../comments/types/comment-sort-field';
import { getPostListHandler } from '../handlers/get-post-list.handler';
import { getPostHandler } from '../handlers/get-post.handler';
import { createPostHandler } from '../handlers/create-post.handler';
import { updatePostHandler } from '../handlers/update-post.handler';
import { deletePostHandler } from '../handlers/delete-post.handler';
import { getCommentsForPostHandler } from '../../comments/handlers/get-comments-for-post.handler';
import { createCommentForPostHandler } from '../../comments/handlers/create-comment-for-post.handler';

export const postsRouter = Router({});

postsRouter
  .get(
    POSTS_ROUTES.ROOT,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostListHandler,
  )
  .get(POSTS_ROUTES.BY_ID, idValidation, inputValidationResultMiddleware, getPostHandler)
  .get(
    POSTS_ROUTES.COMMENTS_BY_POST_ID,
    postIdParamValidation,
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    getCommentsForPostHandler,
  )
  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .post(
    POSTS_ROUTES.COMMENTS_BY_POST_ID,
    accessTokenGuardMiddleware,
    postIdParamValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    createCommentForPostHandler,
  )
  .put(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );