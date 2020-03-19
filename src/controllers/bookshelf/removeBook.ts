import { Request, Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import Book from '../../entities/book';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../libs/customErrors';

interface RemoveBookRequest extends Request {
  params: { bookshelfId: string };
  body: { bookId: string };
}

const removeBook = async (
  req: RemoveBookRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const { id: userId } = req.user as User;
    const {
      params: { bookshelfId },
      body: { bookId },
    } = req;

    if (!bookshelfId || !bookId) {
      throw new InvalidParamError();
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .innerJoinAndSelect('bookshelf.books', 'book')
      .where('bookshelf.id = :bookshelfId', { bookshelfId: parsedBookshelfId })
      .andWhere('bookshelf.userId = :userId', { userId })
      .andWhere('book.id = :bookId', { bookId })
      .getOne();

    if (!bookshelf) {
      throw new NotFoundError();
    }

    const book = await getRepository(Book).findOne(bookId);

    if (!book) {
      throw new NotFoundError();
    }

    await getConnection()
      .createQueryBuilder()
      .relation(Bookshelf, 'books')
      .of(bookshelf)
      .remove({ id: book.id });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedBook: book,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default removeBook;
