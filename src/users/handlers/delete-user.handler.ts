import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { usersRepository } from '../repositories/users.repository';

export async function deleteUserHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const isDeleted = await usersRepository.delete(req.params.id);

    if (!isDeleted) {
      res.sendStatus(HttpStatus.NotFound_404);
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}