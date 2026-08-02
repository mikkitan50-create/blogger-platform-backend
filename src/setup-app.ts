import express, { Express } from 'express';
import { BLOGS_PATH } from './blogs/constants/blogs.paths';
import { blogsRouter } from './blogs/routers/blogs.router';
import { POSTS_PATH } from './posts/constants/posts.paths';
import { postsRouter } from './posts/routers/posts.router';
import { TESTING_PATH } from './testing/constants/testing.paths';
import { testingRouter } from './testing/routers/testing.router';
import { USERS_PATH } from './users/constants/users.paths';
import { usersRouter } from './users/routers/users.router';
import { AUTH_PATH } from './auth/constants/auth.paths';
import { authRouter } from './auth/routers/auth.router';

export const setupApp = (app: Express) => {
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);

  return app;
};