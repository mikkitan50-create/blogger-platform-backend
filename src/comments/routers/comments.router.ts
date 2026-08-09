import { Router } from 'express';
import { COMMENTS_ROUTES } from '../constants/comments.paths';
import { commentIdParamValidation } from '../../core/middlewares/validation/comment-id-param.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access-token-guard.middleware';
import { commentInputDtoValidation } from '../validation/comment-input-dto.validation';
import { getCommentHandler } from '../handlers/get-comment.handler';
import { updateCommentHandler } from '../handlers/update-comment.handler';
import { deleteCommentHandler } from '../handlers/delete-comment.handler';

export const commentsRouter = Router({});

commentsRouter
  .get(
    COMMENTS_ROUTES.BY_ID,
    commentIdParamValidation,
    inputValidationResultMiddleware,
    getCommentHandler,
  )
  .put(
    COMMENTS_ROUTES.BY_ID,
    accessTokenGuardMiddleware,
    commentIdParamValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  .delete(
    COMMENTS_ROUTES.BY_ID,
    accessTokenGuardMiddleware,
    commentIdParamValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );