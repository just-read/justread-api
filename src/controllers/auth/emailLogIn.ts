import { Request, Response, NextFunction } from 'express';
import User from '../../entities/user';
import { InvalidParamError, IncorrectLoginRequestError, NotFoundError } from '../../utils/errors';

interface LogInRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

const logIn = async (req: LogInRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      body: { email, password },
    } = req;

    if (!email || !password) {
      throw new InvalidParamError('이메일과 비밀번호를 입력해주세요.');
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFoundError('존재하지 않는 이메일입니다.');
    }

    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      throw new IncorrectLoginRequestError();
    }

    const { accessToken, refreshToken } = await user.generateUserTokens();

    console.log(accessToken);
    res.status(200).json({
      success: true,
      message: null,
      result: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default logIn;
