import { Router } from 'express';
import getBookList from '../../controllers/book/getBookList';
import getBookDetails from '../../controllers/book/getBookDetails';

const bookRouter = Router();

bookRouter.get('', getBookList);
bookRouter.get('/:bookId', getBookDetails);

export default bookRouter;
