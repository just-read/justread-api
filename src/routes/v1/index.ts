import { Router } from 'express';
import userRouter from './user';
import bookRouter from './book';

const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/books', bookRouter);

export default v1Router;
