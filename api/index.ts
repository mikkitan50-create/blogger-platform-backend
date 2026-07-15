import express from 'express';
import { setupApp } from '../src/setup-app';
import { SETTINGS } from '../src/settings/config';
import { runDB } from '../src/db/mongo.db';

const app = express();
setupApp(app);

let isDbConnected = false;

app.use(async (req, res, next) => {
  if (!isDbConnected) {
    await runDB(SETTINGS.MONGO_URL);
    isDbConnected = true;
  }
  next();
});

export default app;