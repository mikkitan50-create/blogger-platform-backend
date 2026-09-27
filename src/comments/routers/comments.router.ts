import { Router } from 'express';
import { COMMENTS_ROUTES } from '../constants/comments.paths';
import { commentIdParamValidation } from '../../core/middlewares/validation/comment-id-param.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access-token-guard.middleware';
import { optionalAccessTokenMiddleware } from '../../auth/middlewares/optional-access-token.middleware';
import { commentInputDtoValidation } from '../validation/comment-input-dto.validation';
import { likeInputDtoValidation } from '../validation/like-input-dto.validation';
import { container } from '../../composition/composition-root';
import { TYPES } from '../../composition/types';
import { CommentsController } from '../controllers/comments.controller';

const commentsController = container.get<CommentsController>(TYPES.CommentsController);

export const commentsRouter = Router({});

commentsRouter
  .get(
    COMMENTS_ROUTES.BY_ID,
    optionalAccessTokenMiddleware,
    commentIdParamValidation,
    inputValidationResultMiddleware,
    commentsController.getComment,
  )
  .put(
    COMMENTS_ROUTES.LIKE_STATUS,
    accessTokenGuardMiddleware,
    commentIdParamValidation,
    likeInputDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateLikeStatus,
  )
  .put(
    COMMENTS_ROUTES.BY_ID,
    accessTokenGuardMiddleware,
    commentIdParamValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsController.updateComment,
  )
  .delete(
    COMMENTS_ROUTES.BY_ID,
    accessTokenGuardMiddleware,
    commentIdParamValidation,
    inputValidationResultMiddleware,
    commentsController.deleteComment,
  );