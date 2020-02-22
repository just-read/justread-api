import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import { getBookshelfList, createNewBookshelf } from '../../controllers/bookshelfControllers';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelfList);
bookshelfRouter.post('', privateRoute, createNewBookshelf);

export default bookshelfRouter;
