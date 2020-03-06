import { NextFunction, Response, Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import passport from 'passport';
import {
  StrategyOptions,
  ExtractJwt,
  Strategy as JWTStrategy,
  VerifiedCallback,
} from 'passport-jwt';
import { getRepository } from 'typeorm';
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

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'DEFAULT_JSON_SECRET_KEY';

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET_KEY,
};

const generateToken = async (user: User, options?: SignOptions): Promise<string> => {
  const jwtOptions: SignOptions = {
    issuer: 'justread.best',
    expiresIn: '7d',
    ...options,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const decodeToken = async <T = any>(token: string): Promise<T> =>
  new Promise((resolve, reject) => {
    if (!TOKEN_SECRET_KEY) return;
    jwt.verify(token, TOKEN_SECRET_KEY, (error, decoded) => {
      if (error) reject(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resolve(decoded as any);
    });
  });

const verifyJWTUser = async (payload: AuthTokenData, done: VerifiedCallback): Promise<void> => {
  try {
    const user = await getRepository(User).findOne({ id: payload.id });
    if (user) {
      return done(null, user);
    }
    return done(null, null);
  } catch (error) {
    return done(error, null);
  }
};

const passportAuthenticate = (req: Request, res: Response, next: NextFunction): void =>
  passport.authenticate(['jwt'], { session: false }, (error: Error, user: User | null) => {
    if (error) {
      next(error);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

const privateRoute = (req: Request, res: Response, next: NextFunction): void => {
  const { user } = req;
  if (!user) {
    throw new UnauthorizedError();
  }
  next();
};

passport.use(new JWTStrategy(jwtOptions, verifyJWTUser));

export { generateToken, decodeToken, passportAuthenticate, privateRoute };
