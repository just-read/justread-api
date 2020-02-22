import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import { getBookshelfList, createNewBookshelf } from '../../controllers/bookshelfControllers';
import getBookshelfDetails from '../../controllers/bookshelf/getBookshelfDetailss';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelfList);
bookshelfRouter.get('/:bookshelfId', privateRoute, getBookshelfDetails);
bookshelfRouter.post('', privateRoute, createNewBookshelf);

export default bookshelfRouter;
