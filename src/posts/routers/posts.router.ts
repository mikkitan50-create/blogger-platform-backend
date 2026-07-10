// src/posts/routers/posts.router.ts

import { Router } from 'express';
import { POSTS_ROUTES } from '../constants/posts.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { postInputDtoValidation } from '../validation/post-input-dto.validation';
import { getPostListHandler } from '../handlers/get-post-list.handler';
import { getPostHandler } from '../handlers/get-post.handler';
import { createPostHandler } from '../handlers/create-post.handler';
import { updatePostHandler } from '../handlers/update-post.handler';
import { deletePostHandler } from '../handlers/delete-post.handler';

export const postsRouter = Router({});

postsRouter
  .get(POSTS_ROUTES.ROOT, getPostListHandler)
  .get(POSTS_ROUTES.BY_ID, idValidation, inputValidationResultMiddleware, getPostHandler)
  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    createPostHandler,
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