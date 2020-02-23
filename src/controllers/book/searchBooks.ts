import { Request, Response, NextFunction } from 'express';
import { getRepository, Like } from 'typeorm';
import Book from '../../entities/book';

interface SearchBooksRequest extends Request {
  query: {
    q?: string;
  };
}

const searchBooks = async (
  req: SearchBooksRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    query: { q: searchTerm }
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

      /**
       * 책 숫자가 많아지면 성능 저하가 있을 것으로 예상됨
       * 일단 구현이 목표니 이대로 하고 나중에 개선하는 걸로
       */
      let books: [Book[], number] = [[], 0];
      if (isISBN(searchTerm)) {
        books = await getRepository(Book).findAndCount({
          where: {
            isbn: searchTerm
          }
        });
      } else {
        books = await getRepository(Book)
          .createQueryBuilder('book')
          .where('book.title LIKE :searchTerm', { searchTerm })
          .orWhere('book.author LIKE :searchTerm', { searchTerm })
          .getManyAndCount();
      }

      res.status(200).json({
        success: true,
        message: null,
        result: {
          books: books[0],
          count: books[1]
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
