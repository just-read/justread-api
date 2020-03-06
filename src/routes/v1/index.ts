import { Router } from 'express';
import authRouter from './auth';
import bookRouter from './book';
import bookshelfRouter from './bookshelf';
import ratingRouter from './rating';
import reviewRouter from './review';
import userRouter from './user';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/books', bookRouter);
v1Router.use('/bookshelves', bookshelfRouter);
v1Router.use('/ratings', ratingRouter);
v1Router.use('/reviews', reviewRouter);
v1Router.use('/users', userRouter);

export default v1Router;
