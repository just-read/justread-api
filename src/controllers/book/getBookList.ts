import { Request, Response, NextFunction } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

export enum EnumBookListType {
  RECENT = 'recent',
  POPULAR = 'popular',
  RECOMMEND = 'recomend'
}

type BookListStrings = keyof typeof EnumBookListType;

interface GetBookListRequest extends Request {
  query: {
    type: BookListStrings;
    page: number;
    limit: number;
  };
}

const getBookList = async (
  req: GetBookListRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      query: { type = EnumBookListType.RECENT, page = 1, limit = 10 }
    } = req;

    if (!(type in EnumBookListType)) {
      throw new InvalidParamError('type이 올바르지 않습니다.');
    }

    const offset = page * limit;
    const getRecentBookList = async (): Promise<[Book[], number]> =>
      Book.findAndCount({
        take: limit,
        skip: offset,
        order: {
          id: 'DESC'
        }
      });

    const bookItems = await getRecentBookList();

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookItems
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookList;
