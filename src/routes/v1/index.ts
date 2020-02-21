import { Router } from 'express';
import userRouter from './user';
import bookRouter from './book';
import bookshelfRouter from './bookshelf';

const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/books', bookRouter);
v1Router.use('/bookshelves', bookshelfRouter);

export default v1Router;
