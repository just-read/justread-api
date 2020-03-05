import { Request, Response, NextFunction } from 'express';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError } from '../../utils/customErrors';

interface CreateNewBookshelfRequest extends Request {
  body: { name: string };
}

const createNewBookshelf = async (
  req: CreateNewBookshelfRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다');
    }

    const { id: userId } = req.user as User;
    const {
      body: { name },
    } = req;

    if (!name) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const newBookshelf = await Bookshelf.create({ name, userId }).save();
    res.status(201).json({
      success: true,
      message: null,
      result: {
        newBookshelf,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default createNewBookshelf;
