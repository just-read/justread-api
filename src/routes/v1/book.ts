import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import { getBookList, getBookDetails, addNewBook } from '../../controllers/bookControllers';

const bookRouter = Router();

bookRouter.get('', getBookList);
bookRouter.get('/:bookUniqueId', getBookDetails);
bookRouter.post('', privateRoute, addNewBook);

export default bookRouter;
