import cors from 'cors';
import express from 'express';
import passport from 'passport';

import { config } from './config';
import { prisma } from '@utils/orm';
import { STRATEGY } from '@middlewares/auth.middleware';
import { logger, httpRequestLogger } from '@utils/logger';
import { ErrorHandler } from '@middlewares/error.middleware';

import authRoutes from '@features/auth/auth.routes';
import userRoutes from '@features/user/user.routes';

const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpRequestLogger);
app.use(passport.use(STRATEGY).initialize());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.use(ErrorHandler);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    logger.info(`✅ Server started from ${config.NODE_ENV} at http://localhost:${PORT}`);
  } catch (error) {
    logger.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`
🛑 Received ${signal}. Gracefully shutting down...`);
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
