import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { EnumBookListType } from '../../types/enums';
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '../../utils/constants';
import { isISBN } from '../../utils/validation';

export interface GetBooksRequest extends Request {
  query: {
    type: EnumBookListType;
    q: string;
    page: string;
    limit: string;
  };
}

const searchBooks = async (
  req: GetBooksRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    query: { q: searchTerm, page, limit },
  } = req;
  if (searchTerm) {
    try {
      const parsedPage = page ? parseInt(page, 10) : DEFAULT_PAGE;
      const parsedLimit = limit ? parseInt(limit, 10) : DEFAULT_LIMIT;
      const offset = (parsedPage - 1) * parsedLimit;

      /**
       * 책 숫자가 많아지면 성능 저하가 있을 것으로 예상됨
       * 일단 구현이 목표니 이대로 하고 나중에 개선하는 걸로
       */
      let initialBookItemsInfo: BookList = {
        books: [],
        total: 0,
        count: 0,
      };

      if (isISBN(searchTerm)) {
        const searchWithISBN = async (): Promise<BookList> => {
          const total = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.isbn = :searchTerm', { searchTerm })
            .getCount();
          const [books, count] = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.isbn = :searchTerm', { searchTerm })
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
        const searchResult = await searchWithISBN();
        initialBookItemsInfo = { ...searchResult };
      } else {
        const searchWithTerm = async (): Promise<BookList> => {
          const total = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.title LIKE :term', { term: `%${searchTerm}%` })
            .orWhere('book.authors LIKE :term', { term: `%${searchTerm}%` })
            .getCount();
          const [books, count] = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.title LIKE :term', { term: `%${searchTerm}%` })
            .orWhere('book.authors LIKE :term', { term: `%${searchTerm}%` })
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
        const searchResult = await searchWithTerm();
        initialBookItemsInfo = { ...searchResult };
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
  } else {
    next();
  }
};

export default searchBooks;
