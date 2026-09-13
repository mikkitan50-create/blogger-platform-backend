import { searchNameTermValidation } from '../validation/search-name-term.validation';
import { Router } from 'express';
import { BLOGS_ROUTES } from '../constants/blogs.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { blogIdParamValidation } from '../../core/middlewares/validation/blog-id-param.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { blogInputDtoValidation } from '../validation/blog-input-dto.validation';
import { postInputDtoForBlogValidation } from '../../posts/validation/post-input-dto-for-blog.validation';
import { BlogSortField } from '../types/blog-sort-field';
import { PostSortField } from '../../posts/types/post-sort-field';
import { getPostsForBlogHandler } from '../../posts/handlers/get-posts-for-blog.handler';
import { createPostForBlogHandler } from '../../posts/handlers/create-post-for-blog.handler';
import { ioc } from '../../composition/composition-root';
import { BlogsController } from '../controllers/blogs.controller';

const blogsController = ioc.getInstance(BlogsController);

export const blogsRouter = Router({});

blogsRouter
  .get(
    BLOGS_ROUTES.ROOT,
    paginationAndSortingValidation(BlogSortField),
    searchNameTermValidation,
    inputValidationResultMiddleware,
    blogsController.getBlogList,
  )
  .get(BLOGS_ROUTES.BY_ID, idValidation, inputValidationResultMiddleware, blogsController.getBlog)
  .get(
    BLOGS_ROUTES.POSTS_BY_BLOG_ID,
    blogIdParamValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getPostsForBlogHandler,
  )
  .post(
    BLOGS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.createBlog,
  )
  .post(
    BLOGS_ROUTES.POSTS_BY_BLOG_ID,
    superAdminGuardMiddleware,
    blogIdParamValidation,
    postInputDtoForBlogValidation,
    inputValidationResultMiddleware,
    createPostForBlogHandler,
  )
  .put(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    blogInputDtoValidation,
    inputValidationResultMiddleware,
    blogsController.updateBlog,
  )
  .delete(
    BLOGS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    blogsController.deleteBlog,
  );