import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { db } from '../../db/in-memory.db';

export function truncateDbHandler(req: Request, res: Response) {
  db.blogs = [];
  db.posts = [];
  res.sendStatus(HttpStatus.NoContent_204);
}