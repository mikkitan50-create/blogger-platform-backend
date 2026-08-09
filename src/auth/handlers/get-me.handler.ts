import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { usersRepository } from '../../users/repositories/users.repository';

export async function getMeHandler(req: Request, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized_401);
      return;
    }

    const user = await usersRepository.findById(userId);
    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized_401);
      return;
    }

    res.status(HttpStatus.Ok_200).send({
      email: user.email,
      login: user.login,
      userId: user._id.toString(),
    });
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}