import { Router } from 'express';
import signUp from '../../controllers/user/signUp';
import logIn from '../../controllers/user/logIn';
import refreshTokens from '../../controllers/user/refreshTokens';

const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', logIn);
userRouter.post('/tokens', refreshTokens);

export default userRouter;
