import { Request, Response } from 'express';
import User from '../../entities/user';
import { createToken } from '../../utils/auth';

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
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // TODO: 커스텀 에러로 대체 예정
    throw new Error('이미 존재하는 이메일입니다.');
  }
  const newUser = await User.create({ email, password, nickName }).save();
  const token = createToken(newUser);
  return res.status(201).json({
    success: true,
    message: null,
    result: {
      token
    }
  });
};

export default signUp;
