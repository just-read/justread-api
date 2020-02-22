import { CustomRequest } from '../../utils/auth';
import { Response, NextFunction } from 'express';
import { UnauthorizedError, InvalidParamError } from '../../utils/customErrors';
import Bookshelf from '../../entities/bookshelf';

interface CreateNewBookshelfRequest extends CustomRequest {
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

    const {
      body: { name }
    } = req;

    if (!name) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const newBookshelf = await Bookshelf.create({ name }).save();
    res.status(201).json({
      success: true,
      message: null,
      result: {
        newBookshelf
      }
    });
  } catch (error) {
    next(error);
  }
};

export default createNewBookshelf;
