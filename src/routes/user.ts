import { Router } from 'express';
import signUp from '../controllers/user/signUp';
import logIn from '../controllers/user/logIn';

const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', logIn);

export default userRouter;
