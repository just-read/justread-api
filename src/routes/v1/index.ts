import { Router } from 'express';
import userRouter from './user';
import bookRouter from './book';
import bookshelfRouter from './bookshelf';
import ratingRouter from './rating';

const v1Router = Router();

v1Router.use('/users', userRouter);
v1Router.use('/books', bookRouter);
v1Router.use('/bookshelves', bookshelfRouter);
v1Router.use('/ratings', ratingRouter);

export default v1Router;
