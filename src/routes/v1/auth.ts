import { Router } from 'express';
import {
  emailLogIn,
  emailSignUp,
  googleSignIn,
  refreshTokens,
} from '../../controllers/authControllers';

const authRouter = Router();

authRouter.post('/login', emailLogIn);
authRouter.post('/signup', emailSignUp);
authRouter.post('/google', googleSignIn);
authRouter.post('/tokens', refreshTokens);

export default authRouter;
