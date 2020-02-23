import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import { getBooks, getBookDetails, addNewBook } from '../../controllers/bookControllers';

const bookRouter = Router();

bookRouter.get('', getBooks);
bookRouter.get('/:bookUniqueId', getBookDetails);
bookRouter.post('', privateRoute, addNewBook);

export default bookRouter;
