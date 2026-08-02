import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { usersService } from '../application/users.service';
import { UserInputModel } from '../types/user';

export async function createUserHandler(
  req: Request<{}, {}, UserInputModel>,
  res: Response,
) {
  try {
    const result = await usersService.createUser(req.body);

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
}