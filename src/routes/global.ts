import { Router, Request, Response } from 'express';
import userRouter from './user';

const globalRouter = Router();

globalRouter.get('/', (_: Request, res: Response) => {
  res.send({
    success: true,
    message: 'JustRead API'
  });
});

globalRouter.use('/user', userRouter);

export default globalRouter;
