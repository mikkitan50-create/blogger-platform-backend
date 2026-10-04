import { Router } from 'express';
import { POSTS_ROUTES } from '../constants/posts.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { postIdParamValidation } from '../../core/middlewares/validation/post-id-param.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { accessTokenGuardMiddleware } from '../../auth/middlewares/access-token-guard.middleware';
import { optionalAccessTokenMiddleware } from '../../auth/middlewares/optional-access-token.middleware';
import { postInputDtoValidation } from '../validation/post-input-dto.validation';
import { commentInputDtoValidation } from '../../comments/validation/comment-input-dto.validation';
import { likeInputDtoValidation } from '../../comments/validation/like-input-dto.validation';
import { PostSortField } from '../types/post-sort-field';
import { CommentSortField } from '../../comments/types/comment-sort-field';
import { container } from '../../composition/composition-root';
import { TYPES } from '../../composition/types';
import { PostsController } from '../controllers/posts.controller';
import { CommentsController } from '../../comments/controllers/comments.controller';

const postsController = container.get<PostsController>(TYPES.PostsController);
const commentsController = container.get<CommentsController>(TYPES.CommentsController);

export const postsRouter = Router({});

postsRouter
  .get(
    POSTS_ROUTES.ROOT,
    optionalAccessTokenMiddleware,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    postsController.getPostList,
  )
  .get(
    POSTS_ROUTES.BY_ID,
    optionalAccessTokenMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.getPost,
  )
  .get(
    POSTS_ROUTES.COMMENTS_BY_POST_ID,
    optionalAccessTokenMiddleware,
    postIdParamValidation,
    paginationAndSortingValidation(CommentSortField),
    inputValidationResultMiddleware,
    commentsController.getCommentsForPost,
  )
  .post(
    POSTS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.createPost,
  )
  .post(
    POSTS_ROUTES.COMMENTS_BY_POST_ID,
    accessTokenGuardMiddleware,
    postIdParamValidation,
    commentInputDtoValidation,
    inputValidationResultMiddleware,
    commentsController.createCommentForPost,
  )
  .put(
    POSTS_ROUTES.LIKE_STATUS,
    accessTokenGuardMiddleware,
    postIdParamValidation,
    likeInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updateLikeStatus,
  )
  .put(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResultMiddleware,
    postsController.updatePost,
  )
  .delete(
    POSTS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    postsController.deletePost,
  );