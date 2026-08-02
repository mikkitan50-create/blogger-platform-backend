import { Router } from 'express';
import { USERS_ROUTES } from '../constants/users.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { userInputDtoValidation } from '../validation/user-input-dto.validation';
import { searchLoginTermValidation, searchEmailTermValidation } from '../validation/search-users-term.validation';
import { UserSortField } from '../types/user-sort-field';
import { getUserListHandler } from '../handlers/get-user-list.handler';
import { createUserHandler } from '../handlers/create-user.handler';
import { deleteUserHandler } from '../handlers/delete-user.handler';

export const usersRouter = Router({});

usersRouter
  .get(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    searchLoginTermValidation,
    searchEmailTermValidation,
    inputValidationResultMiddleware,
    getUserListHandler,
  )
  .post(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler,
  )
  .delete(
    USERS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler,
  );