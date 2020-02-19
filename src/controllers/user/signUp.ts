import { Request, Response } from 'express';
import User from '../../entities/user';
import { AlreadyExistsError, InvalidParamError } from '../../utils/customErrors';

interface SignUpRequest extends Request {
  body: {
    email: string;
    password: string;
    nickName: string;
  };
}

const signUp = async (req: SignUpRequest, res: Response): Promise<Response> => {
  const {
    body: { email, password, nickName }
  } = req;
  if (!email || !password || !nickName) {
    throw new InvalidParamError('필요한 정보가 누락되었습니다.');
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AlreadyExistsError('이미 존재하는 이메일입니다.');
  }
  const newUser = await User.create({ email, password, nickName }).save();
  const { accessToken, refreshToken } = await newUser.generateUserTokens();
  return res.status(201).json({
    success: true,
    message: null,
    result: {
      accessToken,
      refreshToken
    }
  });
};

export default signUp;
