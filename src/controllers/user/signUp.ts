import { Request, Response } from 'express';
import User from '../../entities/user';

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
    throw new Error('이미 존재하는 이메일입니다.');
  }
  const newUser = await User.create({ email, password, nickName }).save();
  return res.status(201).json({
    success: true,
    message: null,
    result: {
      user: newUser
    }
  });
};

export default signUp;
