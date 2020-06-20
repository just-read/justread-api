import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../utils/constants';
import { InvalidParamError } from '../../utils/errors';
import { BookList } from '../../types';
import { EnumBookListType } from '../../types/enums';
import { GetBooksRequest } from './searchBooks';

const getBooks = async (req: GetBooksRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      query: { type = EnumBookListType.recent, page, limit },
    } = req;

    if (!(type in EnumBookListType)) {
      throw new InvalidParamError('type이 올바르지 않습니다.');
    }

    const parsedPage = page ? parseInt(page, 10) : DEFAULT_PAGE;
    const parsedLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT;

    const offset = (parsedPage - 1) * parsedLimit;

    const getRecentBookListInfo = async (): Promise<BookList> => {
      const total = await getRepository(Book).createQueryBuilder('book').getCount();
      const [books, count] = await getRepository(Book)
        .createQueryBuilder('book')
        .limit(parsedLimit)
        .offset(offset)
        .orderBy('book.id', 'DESC')
        .getManyAndCount();
      return {
        books,
        count,
        total,
      };
    };

    let initialBookItemsInfo: BookList = {
      books: [],
      total: 0,
      count: 0,
    };

    // 모양이 영 마음에 안 드는데 더 깔끔한 방법이 생기면 수정하기로 하자
    switch (type) {
      case 'popular': {
        break;
      }
      default: {
        const recentInfo = await getRecentBookListInfo();
        initialBookItemsInfo = {
          ...recentInfo,
        };
        break;
      }
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        books: initialBookItemsInfo.books,
        pageInfo: {
          total: initialBookItemsInfo.total,
          current: page,
          limit,
          count: initialBookItemsInfo.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getBooks;
