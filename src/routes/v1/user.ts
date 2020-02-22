import { Router } from 'express';
import { signUp, logIn, refreshTokens } from '../../controllers/userController';

const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', logIn);
userRouter.post('/tokens', refreshTokens);

export default userRouter;
