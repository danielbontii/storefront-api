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
const address = '0.0.0.0:3000';

app.use(express.json());

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    initDb();
    app.listen(PORT, async function () {
      console.log(`starting app on: ${address}`);
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
app.use(notFoundMiddleWare)

export default app;
