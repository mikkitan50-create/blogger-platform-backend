import express from 'express';
import { setupApp } from './setup-app';

const app = express();
setupApp(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});