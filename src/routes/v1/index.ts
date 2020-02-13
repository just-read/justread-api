import { Router } from 'express';
import userRouter from './user';
import bookRouter from './book';

const v1Router = Router();

v1Router.use('/user', userRouter);
v1Router.use('/book', bookRouter);

export default v1Router;
