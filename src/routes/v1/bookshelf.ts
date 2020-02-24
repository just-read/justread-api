import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import {
  createNewBookshelf,
  getBookshelves,
  getBookshelfDetails,
  removeBookshelf
} from '../../controllers/bookshelfControllers';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelves);
bookshelfRouter.get('/:bookshelfId', privateRoute, getBookshelfDetails);
bookshelfRouter.post('', privateRoute, createNewBookshelf);
bookshelfRouter.delete('/:bookshelfId', privateRoute, removeBookshelf);

export default bookshelfRouter;
