import { Router, Request, Response } from 'express';
import v1Router from './v1';

const globalRouter = Router();

globalRouter.get('/', (_: Request, res: Response) => {
  res.json({
    success: true,
    message: 'JustRead API',
  });
});

globalRouter.use('/v1', v1Router);

export default globalRouter;
