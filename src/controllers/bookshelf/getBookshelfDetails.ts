import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';
import Bookshelf from '../../entities/bookshelf';
import { getRepository } from 'typeorm';

interface GetBookshelfDetails extends CustomRequest {
  params: {
    bookshelfId: string;
  };
}

const getBookshelfDetails = async (
  req: GetBookshelfDetails,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { bookshelfId }
    } = req;

    if (!bookshelfId) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelfDetails = await getRepository(Bookshelf).findOne({ id: parsedBookshelfId });

    if (!bookshelfDetails) {
      throw new NotFoundError('일치하는 정보를 찾을 수 없습니다.');
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookshelfDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookshelfDetails;
