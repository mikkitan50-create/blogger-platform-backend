import express from 'express';
import { setupApp } from './setup-app';
import { SETTINGS } from './settings/config';
import { runDB } from './db/mongo.db';

const bootstrap = async () => {
  const app = express();
  setupApp(app);

  await runDB(SETTINGS.MONGO_URL);

  app.listen(SETTINGS.PORT, () => {
    console.log(`Server is running on port ${SETTINGS.PORT}`);
  });

  return app;
};

bootstrap();