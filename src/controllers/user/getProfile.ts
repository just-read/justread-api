import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entities/user';
import { InvalidParamError, NotFoundError } from '../../libs/customErrors';

interface GetProfile extends Request {
  params: {
    userId: string;
  };
}

const getProfile = async (req: GetProfile, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      params: { userId },
    } = req;

    if (!userId) {
      throw new InvalidParamError();
    }

    const parsedUserId = parseInt(userId, 10);

    const userInfo = await getRepository(User).findOne({ id: parsedUserId });

    if (!userInfo) {
      throw new NotFoundError();
    }

    // TODO: 프로필에 어떤 정보를 더 챙길지 고민이 필요함...
    res.status(200).json({
      success: true,
      message: null,
      result: {
        userInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getProfile;
