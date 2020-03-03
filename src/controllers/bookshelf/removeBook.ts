import { Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import Book from '../../entities/book';
import Bookshelf from '../../entities/bookshelf';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';

interface RemoveBookRequest extends CustomRequest {
  params: { bookshelfId: string };
  body: { bookUniqueId: string };
}

const removeBook = async (
  req: RemoveBookRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { bookshelfId },
      body: { bookUniqueId },
      user: { id: userId }
    } = req;

    if (!bookshelfId || !bookUniqueId) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf)
      .createQueryBuilder('bookshelf')
      .innerJoinAndSelect('bookshelf.books', 'book')
      .where('bookshelf.id = :bookshelfId', { bookshelfId: parsedBookshelfId })
      .andWhere('bookshelf.userId = :userId', { userId })
      .andWhere('book.uniqueId = :bookUniqueId', { bookUniqueId })
      .getOne();

    if (!bookshelf) {
      throw new NotFoundError();
    }

    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

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
        removedBook: book
      }
    });
  } catch (error) {
    next(error);
  }
};

export default removeBook;
