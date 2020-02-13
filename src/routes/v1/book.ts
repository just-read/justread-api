import { Router } from 'express';
import getBookList from '../../controllers/book/getBookList';

const bookRouter = Router();

bookRouter.get('/books', getBookList);

export default bookRouter;
