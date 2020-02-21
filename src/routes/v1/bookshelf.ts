import { Router } from 'express';
import getBookshelfList from '../../controllers/bookshelf/getBookshelfList';
import { privateRoute } from '../../utils/auth';

const bookshelfRouter = Router();

bookshelfRouter.get('', privateRoute, getBookshelfList);

export default bookshelfRouter;
