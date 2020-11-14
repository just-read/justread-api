import { Router } from 'express';
import {
  emailLogIn,
  emailSignUp,
  googleLogIn,
  refreshTokens,
} from '../../controllers/authControllers';

const authRouter = Router();

authRouter.post('/login', emailLogIn);
authRouter.post('/signup', emailSignUp);
authRouter.post('/google', googleLogIn);
authRouter.post('/tokens', refreshTokens);

export default authRouter;
