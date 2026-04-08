import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();

export const startServer = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const app = express();

  // Порт: Render призначає PORT, локально беремо 4000
  const PORT = process.env.PORT || 4000;

  // 1. Логер
  app.use(
    pino({
      transport: process.env.NODE_ENV !== 'production' 
        ? { target: 'pino-pretty' } 
        : undefined,
    })
  );

  // 2. CORS для локалки / продакшн
  const allowedOrigin = process.env.NODE_ENV === 'production'
    ? process.env.APP_URL
    : 'http://localhost:3000';

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // 3. Swagger
  const swaggerDoc = yaml.load(
    fs.readFileSync(path.join(process.cwd(), 'docs/swagger.yaml'), 'utf8')
  );
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

  // 4. Головний роутер
  app.use('/api', router);

  // 5. Головна сторінка
  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
  });

  // 6. 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  // 7. Error handler
  app.use(errorHandler);

  // 8. Запуск сервера
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
};

startServer();