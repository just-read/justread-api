import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError } from '../../utils/customErrors';
import Bookshelf from '../../entities/bookshelf';

interface GetBookshelvesRequest extends CustomRequest {
  query: {
    page: number;
    limit: number;
  };
}

const getBookshelves = async (
  req: GetBookshelvesRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      user: { id: userId },
      query: { page = 1, limit = 10 }
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
          count
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookshelves;
