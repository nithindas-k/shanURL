import 'dotenv/config'; // reload trigger
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.config';
import { appConfig } from './config/app.config';
import router from './routes/index';
import { MESSAGES } from './constants/messages.constants';
import { STATUS_CODES } from './constants/status-codes.constants';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// 404 handler
app.use((_req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    success: false,
    statusCode: STATUS_CODES.NOT_FOUND,
    message: MESSAGES.SERVER.NOT_FOUND,
    data: null,
  });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(appConfig.port, () => {
      console.log(`Server running on port ${appConfig.port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
