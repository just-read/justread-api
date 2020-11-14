import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entities/user';
import { UnauthorizedError } from '../../utils/errors';
import { verifyGoogleToken } from '../../utils/validation';

interface GoogleLogInRequest extends Request {
  body: {
    email: string;
    nickName: string;
    googleId: string;
    tokenId: string;
  };
}

const googleLogIn = async (
  req: GoogleLogInRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      body: { email, nickName, googleId, tokenId },
    } = req;

    const isValid = await verifyGoogleToken({
      originEmail: email,
      originGoogleId: googleId,
      tokenId,
    });

    if (!isValid) {
      throw new UnauthorizedError('잘못된 인증 정보입니다.');
    }

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
