import { Request, Response, NextFunction } from 'express';
import { getRepository, Like } from 'typeorm';
import Book from '../../entities/book';

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
    query: { q: searchTerm, page = 1, limit = 10 }
  } = req;
  if (searchTerm) {
    try {
      const isISBN = (term: string): boolean => {
        const isbnRegexp = new RegExp(/^.d{13}$/);
        if (isbnRegexp.test(term)) {
          return true;
        }
        return false;
      };

      const offset = page * limit;

      /**
       * 책 숫자가 많아지면 성능 저하가 있을 것으로 예상됨
       * 일단 구현이 목표니 이대로 하고 나중에 개선하는 걸로
       */
      let total = 0;
      let books: [Book[], number] = [[], 0];
      if (isISBN(searchTerm)) {
        total = await getRepository(Book)
          .createQueryBuilder()
          .where('isbn = :isbn', { isbn: searchTerm })
          .getCount();
        books = await getRepository(Book).findAndCount({
          where: {
            isbn: searchTerm
          },
          take: limit,
          skip: offset,
          order: {
            id: 'DESC'
          }
        });
      } else {
        total = await getRepository(Book)
          .createQueryBuilder()
          .where('book.title LIKE :searchTerm', { searchTerm })
          .orWhere('book.author LIKE :searchTerm', { searchTerm })
          .getCount();
        books = await getRepository(Book)
          .createQueryBuilder('book')
          .where('book.title LIKE :searchTerm', { searchTerm })
          .orWhere('book.author LIKE :searchTerm', { searchTerm })
          .limit(limit)
          .offset(offset)
          .orderBy('id', 'DESC')
          .getManyAndCount();
      }
      // 아무래도 ORM 쿼리빌더 사용 통일화가 필요할 것 같다

      res.status(200).json({
        success: true,
        message: null,
        result: {
          bookItems: books[0],
          pageInfo: {
            total: total,
            current: page,
            limit,
            count: books[1]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

export default searchBooks;
