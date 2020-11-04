import { Request, Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import Book from 'entities/book';
import Bookshelf from 'entities/bookshelf';
import User from 'entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from 'utils/errors';

interface AddBookRequest extends Request {
  params: {
    bookshelfId: string;
  };
  body: {
    bookId: string;
  };
}

const addBook = async (req: AddBookRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      params: { bookshelfId },
      body: { bookId },
      user: { id: userId },
    } = req;

    if (!bookshelfId || !bookId) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf).findOne({ id: parsedBookshelfId, userId });
    const book = await getRepository(Book).findOne(bookId);

    if (!bookshelf || !book) {
      throw new NotFoundError();
    }

    await getConnection().createQueryBuilder().relation(Bookshelf, 'books').of(bookshelf).add(book);

    res.status(201).json({
      success: true,
      message: null,
      result: {
        // 무슨 데이터를 더 줘야 할까?
        bookshelf,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default addBook;
