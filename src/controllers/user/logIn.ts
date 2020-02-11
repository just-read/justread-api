import { Request, Response } from 'express';
import User from '../../entities/user';
import { createToken } from '../../utils/auth';

interface LogInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const logIn = async (req: LogInRequest, res: Response): Promise<Response> => {
  const {
    body: { email, password }
  } = req;
  const user = await User.findOne({ email });
  if (!user) {
    // TODO: 커스텀 에러로 대체 예정
    throw Error('존재하지 않는 이메일입니다.');
  }
  const checkPassword = await user.comparePassword(password);
  if (!checkPassword) {
    // TODO: 커스텀 에러로 대체 예정
    throw Error('입력하신 정보가 올바르지 않습니다.');
  }
  const token = createToken(user);
  return res.status(200).json({
    success: true,
    message: null,
    result: {
      token
    }
  });
};

export default logIn;
