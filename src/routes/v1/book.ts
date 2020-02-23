import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import {
  addNewBook,
  getBookDetails,
  getBooks,
  modifyBook,
  searchBooks
} from '../../controllers/bookControllers';

const bookRouter = Router();

bookRouter.get('', searchBooks, getBooks);
bookRouter.get('/:bookUniqueId', getBookDetails);
bookRouter.post('', privateRoute, addNewBook);
bookRouter.put('/:bookUniqueId', privateRoute, modifyBook);

export default bookRouter;
