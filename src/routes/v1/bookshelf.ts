import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import { getBookshelves, createNewBookshelf } from '../../controllers/bookshelfControllers';
import getBookshelfDetails from '../../controllers/bookshelf/getBookshelfDetails';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelves);
bookshelfRouter.get('/:bookshelfId', privateRoute, getBookshelfDetails);
bookshelfRouter.post('', privateRoute, createNewBookshelf);

export default bookshelfRouter;
