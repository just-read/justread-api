import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entities/user';
import { decodeToken, RefreshTokenData } from '../../libs/auth';
import { UnauthorizedError } from '../../libs/middlewares/customErrors';

interface RefreshTokensRequest extends Request {
  body: {
    refreshToken: string;
  };
}

const refreshTokens = async (
  req: RefreshTokensRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      body: { refreshToken: originalRefreshToken },
    } = req;
    const decoded = await decodeToken<RefreshTokenData>(originalRefreshToken);
    const user = await getRepository(User).findOne(decoded.id);
    if (!user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }
    const { accessToken, refreshToken } = await user.refreshUserTokens(
      originalRefreshToken,
      decoded.exp,
    );
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

export default refreshTokens;
