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
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다.');
    }

    const {
      user: { id: userId },
      query: { page = 1, limit = 10 }
    } = req;

    const total = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .getCount();
    const [bookshelves, count] = await Bookshelf.findAndCount({
      where: {
        userId
      }
    });

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
