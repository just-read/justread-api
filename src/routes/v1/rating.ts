import { Router } from 'express';
import { setBookRating } from '../../controllers/ratingControllers';
import { privateRoute } from '../../utils/auth';

const ratingRouter = Router();

ratingRouter.post('', privateRoute, setBookRating);

export default ratingRouter;
