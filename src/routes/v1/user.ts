import { Router } from 'express';
import { getProfile } from '../../controllers/userController';

const userRouter = Router();

userRouter.get('/:userId', getProfile);

export default userRouter;
