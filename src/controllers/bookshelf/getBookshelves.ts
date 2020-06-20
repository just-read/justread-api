import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../utils/constants';
import { UnauthorizedError } from '../../utils/errors';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';

interface GetBookshelvesRequest extends Request {
  query: {
    page: string;
    limit: string;
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
      query: { page, limit },
    } = req;

    const parsedPage = page ? parseInt(page, 10) : DEFAULT_PAGE;
    const parsedLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT;
    const offset = (parsedPage - 1) * parsedLimit;

    const queryset = getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .where('bookshelf.userId = :userId', { userId });
    const total = await queryset.getCount();
    const [bookshelves, count] = await queryset.limit(parsedLimit).offset(offset).getManyAndCount();

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
