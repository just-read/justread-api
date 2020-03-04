import { Router } from 'express';
import { addBookReview, removeBookReview } from '../../controllers/reviewControllers';
import { privateRoute } from '../../utils/auth';

const reviewRouter = Router();

reviewRouter.post('', privateRoute, addBookReview);
reviewRouter.delete('', privateRoute, removeBookReview);

export default reviewRouter;
