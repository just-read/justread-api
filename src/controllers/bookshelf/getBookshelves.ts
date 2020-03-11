import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../libs/constants';
import { UnauthorizedError } from '../../libs/customErrors';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';

interface GetBookshelvesRequest extends Request {
  query: {
    page: number;
    limit: number;
  };
}

const getBookshelves = async (
  req: GetBookshelvesRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id: userId } = req.user as User;
    const {
      query: { page = DEFAULT_PAGE, limit = DEFAULT_LIMIT },
    } = req;

    const offset = (page - 1) * limit;

    const total = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .where('bookshelf.userId = :userId', { userId })
      .getCount();
    const [bookshelves, count] = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .where('bookshelf.userId = :userId', { userId })
      .limit(limit)
      .offset(offset)
      .getManyAndCount();

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookshelves,
        pageInfo: {
          total,
          current: page,
          limit,
          count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getBookshelves;
