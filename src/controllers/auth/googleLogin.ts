import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entities/user';

interface GoogleLogInRequest extends Request {
  body: {
    email: string;
    nickName: string;
    googleId: string;
  };
}

const googleLogIn = async (
  req: GoogleLogInRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      body: { email, nickName, googleId },
    } = req;

    let user = await getRepository(User).findOne({ googleId });

    if (!user) {
      user = await User.create({ email, nickName, googleId }).save();
    }

    const { accessToken, refreshToken } = await user.generateUserTokens();

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

export default googleLogIn;
