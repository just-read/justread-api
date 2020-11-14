import { Router } from 'express';
import { privateRoute } from '../../utils/auth';
import {
  addNewBook,
  getBookDetails,
  getBookReview,
  getBookReviews,
  getBooks,
  modifyBook,
  searchBooks,
} from '../../controllers/bookControllers';

const bookRouter = Router();

bookRouter.get('', searchBooks, getBooks);
bookRouter.post('', privateRoute, addNewBook);

bookRouter.get('/:bookId', getBookDetails);
bookRouter.put('/:bookId', privateRoute, modifyBook);

bookRouter.get('/:bookId/review', privateRoute, getBookReview); // 내 별점 및 평가
bookRouter.get('/:bookId/reviews', privateRoute, getBookReviews); // 다른 사람들의 별점 및 평가

export default bookRouter;
