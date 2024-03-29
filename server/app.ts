import express, { NextFunction, Request, Response } from 'express';
require('dotenv').config();
export const app = express();
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import ErrorMiddleware from './middlewares/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRoute from './routes/notification.route';
import analyticsRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';
import morgan from 'morgan';
import ErrorHandler from './utils/ErrorHandler';

// body parser
app.use(express.json({ limit: '50mb' }));

// cookie parser
app.use(cookieParser());

app.use(morgan('combined'));

// cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.options('*', cors());

app.use(helmet());

// Ruta de prueba
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ success: true, message: 'Funciona' });
  } catch (error) {
    next(error);
  }
});

// routes
app.use(
  '/api/v1',
  userRouter,
  courseRouter,
  orderRouter,
  notificationRoute,
  analyticsRouter,
  layoutRouter
);

// testing api
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: 'API is working',
  });
});

// unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 404);
  next(err);
});

app.use(ErrorMiddleware);
