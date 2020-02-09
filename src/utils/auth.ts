import jwt from 'jsonwebtoken';
import User from '../entities/user';

const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'DEFAULT_JSON_SECRET_KEY';

const createToken = (user: User): string => {
  const { id, email } = user;
  const token = jwt.sign({ id, email }, TOKEN_SECRET_KEY);
  return token;
};

export { createToken };
