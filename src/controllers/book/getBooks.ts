import { Request, Response, NextFunction } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

export enum EnumBookListType {
  recent = 'recent',
  popular = 'popular',
  recommend = 'recomend'
}

interface GetBookListRequest extends Request {
  query: {
    type: string;
    page: number;
    limit: number;
  };
}

interface InterfaceBookList {
  bookItems: Book[];
  total: number;
  count: number;
}

const getBooks = async (
  req: GetBookListRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      query: { type = EnumBookListType.recent, page = 1, limit = 10 }
    } = req;
    if (!(type in EnumBookListType)) {
      throw new InvalidParamError('type이 올바르지 않습니다.');
    }

    const offset = page * limit;

    const getRecentBookListInfo = async (): Promise<InterfaceBookList> => {
      const recentTotal = await Book.count();
      const recentInfo = await Book.findAndCount({
        take: limit,
        skip: offset,
        order: {
          id: 'DESC'
        }
      });
      return {
        bookItems: recentInfo[0],
        count: recentInfo[1],
        total: recentTotal
      };
    };

    let initialBookItemsInfo: InterfaceBookList = {
      bookItems: [],
      total: 0,
      count: 0
    };

    // 모양이 영 마음에 안 드는데 더 깔끔한 방법이 생기면 수정하기로 하자
    switch (type) {
      default:
        const recentInfo = await getRecentBookListInfo();
        initialBookItemsInfo = {
          ...recentInfo
        };
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookItems: initialBookItemsInfo.bookItems,
        pageInfo: {
          total: initialBookItemsInfo.total,
          current: page,
          limit,
          count: initialBookItemsInfo.count
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBooks;
