import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { getAllCollections } from '../../db/collections';

export async function truncateDbHandler(req: Request, res: Response) {
  try {
    await Promise.all(getAllCollections().map((collection) => collection.deleteMany({})));
    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}