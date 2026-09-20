import { Router } from 'express';
import { USERS_ROUTES } from '../constants/users.paths';
import { idValidation } from '../../core/middlewares/validation/params-id.validation.middleware';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin-guard.middleware';
import { userInputDtoValidation } from '../validation/user-input-dto.validation';
import { searchLoginTermValidation, searchEmailTermValidation } from '../validation/search-users-term.validation';
import { UserSortField } from '../types/user-sort-field';
import { container } from '../../composition/composition-root';
import { TYPES } from '../../composition/types';
import { UsersController } from '../controllers/users.controller';

const usersController = container.get<UsersController>(TYPES.UsersController);

export const usersRouter = Router({});

usersRouter
  .get(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    searchLoginTermValidation,
    searchEmailTermValidation,
    inputValidationResultMiddleware,
    usersController.getUserList,
  )
  .post(
    USERS_ROUTES.ROOT,
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    usersController.createUser,
  )
  .delete(
    USERS_ROUTES.BY_ID,
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    usersController.deleteUser,
  );