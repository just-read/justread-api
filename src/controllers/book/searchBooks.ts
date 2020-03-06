import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { isISBN } from '../../utils/validation';
import { IBookList } from './types';

interface SearchBooksRequest extends Request {
  query: {
    q?: string;
    page: number;
    limit: number;
  };
}

const searchBooks = async (
  req: SearchBooksRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    query: { q: searchTerm, page = 1, limit = 10 },
  } = req;
  if (searchTerm) {
    try {
      const offset = (page - 1) * limit;

      /**
       * 책 숫자가 많아지면 성능 저하가 있을 것으로 예상됨
       * 일단 구현이 목표니 이대로 하고 나중에 개선하는 걸로
       */
      let initialBookItemsInfo: IBookList = {
        books: [],
        total: 0,
        count: 0,
      };

      if (isISBN(searchTerm)) {
        const searchWithISBN = async (): Promise<IBookList> => {
          const total = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.isbn = :searchTerm', { searchTerm })
            .getCount();
          const [books, count] = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.isbn = :searchTerm', { searchTerm })
            .limit(limit)
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
        const searchWithTerm = async (): Promise<IBookList> => {
          const total = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.title LIKE :term', { term: `%${searchTerm}%` })
            .orWhere('book.authors LIKE :term', { term: `%${searchTerm}%` })
            .getCount();
          const [books, count] = await getRepository(Book)
            .createQueryBuilder('book')
            .where('book.title LIKE :term', { term: `%${searchTerm}%` })
            .orWhere('book.authors LIKE :term', { term: `%${searchTerm}%` })
            .limit(limit)
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
