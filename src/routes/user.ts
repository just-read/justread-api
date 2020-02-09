import { Router } from 'express';
import signUp from '../controllers/user/signUp';

const userRouter = Router();

userRouter.post('/signup', signUp);

export default userRouter;
