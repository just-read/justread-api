import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/errors';

interface GetBookshelfDetailsRequest extends Request {
  params: {
    bookshelfId: string;
  };
}

const getBookshelfDetails = async (
  req: GetBookshelfDetailsRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { bookshelfId },
      user: { id: userId },
    } = req;

    if (!bookshelfId) {
      throw new InvalidParamError();
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelfDetails = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .leftJoinAndSelect('bookshelf.books', 'book')
      .where('bookshelf.id = :bookshelfId', { bookshelfId: parsedBookshelfId })
      .andWhere('bookshelf.userId = :userId', { userId })
      .getOne();

    if (!bookshelfDetails) {
      throw new NotFoundError();
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookshelfDetails,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getBookshelfDetails;
