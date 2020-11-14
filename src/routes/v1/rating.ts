import { Router } from 'express';
import { setBookRating, removeBookRating } from '../../controllers/ratingControllers';
import { privateRoute } from '../../utils/auth';

const ratingRouter = Router();

ratingRouter.post('', privateRoute, setBookRating);

ratingRouter.delete('/:ratingId', privateRoute, removeBookRating);

export default ratingRouter;
