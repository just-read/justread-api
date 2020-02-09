import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { createConnection } from 'typeorm';
import connectionOptions from './ormConfig';
import globalRouter from './routes/global';

const createApp = async (): Promise<express.Application> => {
  await createConnection(connectionOptions);

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use(morgan('combined'));

  app.use('', globalRouter);

  return app;
};

export default createApp;
