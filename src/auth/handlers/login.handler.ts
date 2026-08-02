import { Request, Response } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { usersRepository } from '../../users/repositories/users.repository';
import { comparePassword } from '../../users/utils/password.util';

type LoginInputBody = {
  loginOrEmail: string;
  password: string;
};

export async function loginHandler(
  req: Request<{}, {}, LoginInputBody>,
  res: Response,
) {
  try {
    const { loginOrEmail, password } = req.body;

    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!user) {
      res.sendStatus(HttpStatus.Unauthorized_401);
      return;
    }

    const isPasswordCorrect = await comparePassword(password, user.passwordHash);
    if (!isPasswordCorrect) {
      res.sendStatus(HttpStatus.Unauthorized_401);
      return;
    }

    res.sendStatus(HttpStatus.NoContent_204);
  } catch {
    res.sendStatus(HttpStatus.InternalServerError_500);
  }
}