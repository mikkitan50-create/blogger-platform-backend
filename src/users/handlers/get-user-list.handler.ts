import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { usersRepository } from '../repositories/users.repository';
import { mapToUserViewModel } from '../utils/map-to-user-view-model.util';

export async function getUserListHandler(req: Request, res: Response) {
  try {
    const { searchLoginTerm, searchEmailTerm, sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

    const { items, totalCount } = await usersRepository.findMany({
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
}