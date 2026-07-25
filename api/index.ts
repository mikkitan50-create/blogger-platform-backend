import express from 'express';
import { setupApp } from '../src/setup-app';
import { SETTINGS } from '../src/settings/config';
import { runDB } from '../src/db/mongo.db';

const app = express();

let isDbConnected = false;

app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await runDB(SETTINGS.MONGO_URL);
    isDbConnected = true;
  }
  next();
});

setupApp(app);

export default app;