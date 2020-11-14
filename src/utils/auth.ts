import { NextFunction, Response, Request } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import passport from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions as JWTStrategyOptions,
  VerifiedCallback as JWTVerifiedCallback,
} from 'passport-jwt';
import { getRepository } from 'typeorm';
import User from '../entities/user';
import { UnauthorizedError } from './errors';

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

const jwtOptions: JWTStrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET_KEY,
};

const generateToken = async (user: User, options?: SignOptions): Promise<string> => {
  const jwtSignOptions: SignOptions = {
    issuer: 'justread.best',
    expiresIn: '7d',
    ...options,
  };

  if (!jwtSignOptions.expiresIn) {
    delete jwtSignOptions.expiresIn;
  }

  const { id, email } = user;

  return new Promise((resolve, reject) => {
    if (!TOKEN_SECRET_KEY) reject();
    jwt.sign({ id, email }, TOKEN_SECRET_KEY, jwtSignOptions, (error, token) => {
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

const verifyJWTUser = async (payload: AuthTokenData, done: JWTVerifiedCallback): Promise<void> => {
  try {
    const user = await getRepository(User).findOne({ id: payload.id });
    if (user) {
      return done(undefined, user);
    }
    return done(undefined, null);
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

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

export { generateToken, decodeToken, passportAuthenticate, privateRoute };
