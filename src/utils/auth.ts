import { NextFunction, Request, Response } from 'express';
import jwt, { SignOptions, decode } from 'jsonwebtoken';
import User from '../entities/user';

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

const consumeAuthToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const {
    headers: { authorization: authToken }
  } = req;
  if (!authToken) {
    return next();
  }
  const { id, email } = await decodeToken<AuthTokenData>(authToken);
  const user = await User.findOne({ id, email });
  req.user = user;
  return next();
};

export { generateToken, decodeToken, consumeAuthToken };
