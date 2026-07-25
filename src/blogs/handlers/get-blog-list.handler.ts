import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import { HttpStatus } from '../../core/types/http-statuses';
import { mapToPaginatedOutput } from '../../core/utils/map-to-paginated-output.util';
import { blogsRepository } from '../repositories/blogs.repository';
import { mapToBlogViewModel } from '../utils/map-to-blog-view-model.util';

export async function getBlogListHandler(req: Request, res: Response) {
  try {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = matchedData(req);

    const { items, totalCount } = await blogsRepository.findMany({
      searchNameTerm: searchNameTerm || null,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    });

    const paginatedOutput = mapToPaginatedOutput(items.map(mapToBlogViewModel), {
      page: pageNumber,
      pageSize,
      totalCount,
    });

    res.status(HttpStatus.Ok_200).json(paginatedOutput);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}