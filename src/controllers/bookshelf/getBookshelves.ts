import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError } from '../../utils/customErrors';
import Bookshelf from '../../entities/bookshelf';

const getBookshelves = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다.');
    }

    const {
      user: { id: userId }
    } = req;

    const bookShelfItems = await Bookshelf.findAndCount({
      where: {
        userId
      }
    });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookShelfItems
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookshelves;
