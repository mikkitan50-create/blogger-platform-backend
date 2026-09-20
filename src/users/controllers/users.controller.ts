import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { TYPES } from '../../composition/types';
import { UsersService } from '../application/users.service';
import { UserInputModel } from '../types/user';
import { mapToUserViewModel } from '../utils/map-to-user-view-model.util';

@injectable()
export class UsersController {
  constructor(
    @inject(TYPES.UsersService) private usersService: UsersService,
  ) {}

  getUserList = async (req: Request, res: Response): Promise<void> => {
    try {
      const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

      const { items, totalCount } = await this.usersService.getUserList({
        searchLoginTerm: searchLoginTerm || null,
        searchEmailTerm: searchEmailTerm || null,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
      });

      const paginatedOutput = mapToPaginatedOutput(items.map(mapToUserViewModel), {
        page: pageNumber,
        pageSize,
        totalCount,
      });

      res.status(HttpStatus.Ok_200).json(paginatedOutput);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  createUser = async (req: Request<{}, {}, UserInputModel>, res: Response): Promise<void> => {
    try {
      const result = await this.usersService.createUser(req.body);

      if (result.status === 'error') {
        res.status(HttpStatus.BadRequest_400).json({
          errorsMessages: [{ field: result.field, message: result.message }],
        });
        return;
      }

      res.status(HttpStatus.Created_201).json(result.user);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };

  deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    try {
      const isDeleted = await this.usersService.deleteUser(req.params.id);

      if (!isDeleted) {
        res.sendStatus(HttpStatus.NotFound_404);
        return;
      }

      res.sendStatus(HttpStatus.NoContent_204);
    } catch {
      res.sendStatus(HttpStatus.InternalServerError_500);
    }
  };
}