import { Router } from 'express';
import {
  addBook,
  createNewBookshelf,
  getBookshelfDetails,
  getBookshelves,
  modifyBookshelf,
  removeBook,
  removeBookshelf,
} from '../../controllers/bookshelfControllers';
import { privateRoute } from '../../libs/auth';

const bookshelfRouter = Router();

bookshelfRouter.post('', privateRoute, createNewBookshelf);
bookshelfRouter.get('', privateRoute, getBookshelves);
bookshelfRouter.delete('', privateRoute, removeBookshelf);

bookshelfRouter.post('/:bookshelfId', privateRoute, addBook);
bookshelfRouter.get('/:bookshelfId', privateRoute, getBookshelfDetails);
bookshelfRouter.put('/:bookshelfId', privateRoute, modifyBookshelf);
bookshelfRouter.delete('/:bookshelfId', privateRoute, removeBook);

export default bookshelfRouter;
