import express from 'express';

import userRoutes from './handlers/userRoutes';
import categoryRoutes from './handlers/categoryRoutes';
import errorHandlerMiddleware from './middleware/error-handler';
import productRoutes from './handlers/productRoutes';
import orderRoutes from './handlers/orderRoutes';
import authRoutes from './handlers/authRoutes';
import { initDb } from './database';
import notFoundMiddleWare from './middleware/not-found';

const app: express.Application = express();

app.use(express.json());

let PORT: string;

if (process.env.NODE_ENV == 'dev') {
  PORT = process.env.DEV_SERVER_PORT as string;
} else if (process.env.PORT == 'test') {
  PORT = process.env.TEST_SERVER_PORT as string;
} else {
  PORT = '5000';
}

const start = async () => {
  try {
    initDb();
    app.listen(PORT, async function () {
      console.log(`starting app on: ${PORT}`);
    });
  } catch (error) {
    console.log('Failed to start server: ' + error);
  }
};

start();

userRoutes(app);
categoryRoutes(app);
productRoutes(app);
orderRoutes(app);
authRoutes(app);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleWare);

export default app;
