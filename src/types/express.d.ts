import User from '../entities/user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
