import { Router } from 'express';
import { addBookReview } from '../../controllers/reviewControllers';
import { privateRoute } from '../../utils/auth';

const reviewRouter = Router();

reviewRouter.post('', privateRoute, addBookReview);

export default reviewRouter;
