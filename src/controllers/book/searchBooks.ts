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
          .where(`book.title LIKE '%${searchTerm}%'`)
          .orWhere(`book.author LIKE '%${searchTerm}%`)
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
