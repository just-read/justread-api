import { Router } from 'express';
import { addBookReview, removeBookReview, modifyBookReview } from 'controllers/reviewControllers';
import { privateRoute } from 'utils/auth';

const reviewRouter = Router();

reviewRouter.post('', privateRoute, addBookReview);

reviewRouter.put('/:reviewId', privateRoute, modifyBookReview);
reviewRouter.delete('/:reviewId', privateRoute, removeBookReview);

export default reviewRouter;
