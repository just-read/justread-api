import { NextFunction, Response, Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../entities/user';
import { UnauthorizedError } from './customErrors';

export type TokenData = {
  exp: number;
  iss: string;
};

export type AuthTokenData = {
  id: number;
  email: string;
} & TokenData;

export type RefreshTokenData = {
  id: number;
  email: string;
} & TokenData;

export interface CustomRequest extends Request {
  user?: User;
}

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'DEFAULT_JSON_SECRET_KEY';

const generateToken = async (user: User, options?: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'justread.best',
    expiresIn: '7d',
    ...options
  };
  if (!jwtOptions.expiresIn) {
    delete jwtOptions.expiresIn;
  }
  const { id, email } = user;
  return new Promise((resolve, reject) => {
    if (!TOKEN_SECRET_KEY) return;
    jwt.sign({ id, email }, TOKEN_SECRET_KEY, jwtOptions, (error, token) => {
      if (error) reject(error);
      resolve(token);
    });
  });
};

const decodeToken = async <T = any>(token: string): Promise<T> =>
  new Promise((resolve, reject) => {
    if (!TOKEN_SECRET_KEY) return;
    jwt.verify(token, TOKEN_SECRET_KEY, (error, decoded) => {
      if (error) reject(error);
      resolve(decoded as any);
    });
  });

const consumeAuthToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      headers: { authorization: authToken }
    } = req;
    if (authToken) {
      const { id, email } = await decodeToken<AuthTokenData>(authToken);
      const user = await User.findOne({ id, email });
      req.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};

const privateRoute = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const { user } = req;
  if (!user) {
    throw new UnauthorizedError();
  }
  next();
};

export { generateToken, decodeToken, consumeAuthToken, privateRoute };
