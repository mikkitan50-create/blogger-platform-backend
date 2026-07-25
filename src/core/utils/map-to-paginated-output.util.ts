import { PaginatedOutput } from '../types/paginated-output';

export function mapToPaginatedOutput<T>(
  items: T[],
  params: { page: number; pageSize: number; totalCount: number },
): PaginatedOutput<T> {
  return {
    pagesCount: Math.ceil(params.totalCount / params.pageSize),
    page: params.page,
    pageSize: params.pageSize,
    totalCount: params.totalCount,
    items,
  };
}