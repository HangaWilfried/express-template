import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';

import { prisma } from './utils/orm';
import { STRATEGY } from './utils/jwt';
import { ErrorHandler } from './utils/error';
import { LoggerMiddleware } from './utils/middleware';

import authRoutes from './controllers/auth/auth.routes';
import userRoutes from './controllers/user/user.routes';

dotenv.config();

const PORT = 4500;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(LoggerMiddleware);
app.use(passport.use(STRATEGY).initialize());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.use(ErrorHandler);

app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log(`✅ Server started from ${process.env.NODE_ENV} at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
});

const gracefulShutdown = async () => {
  console.log('\n🛑 Gracefully shutting down...');
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});
