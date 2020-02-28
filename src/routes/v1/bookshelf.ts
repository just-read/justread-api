import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import {
  createNewBookshelf,
  getBookshelves,
  getBookshelfDetails,
  modifyBookshelf,
  removeBookshelf,
  addBook
} from '../../controllers/bookshelfControllers';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelves);
bookshelfRouter.get('/:bookshelfId', privateRoute, getBookshelfDetails);
bookshelfRouter.post('', privateRoute, createNewBookshelf);
bookshelfRouter.post('/:bookshelfId', privateRoute, addBook);
bookshelfRouter.put('/:bookshelfId', privateRoute, modifyBookshelf);
bookshelfRouter.delete('/:bookshelfId', privateRoute, removeBookshelf);

export default bookshelfRouter;
