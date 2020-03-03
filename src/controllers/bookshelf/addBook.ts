import { Response, NextFunction } from 'express';
import { getRepository, getConnection } from 'typeorm';
import Book from '../../entities/book';
import Bookshelf from '../../entities/bookshelf';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';

interface AddBookRequest extends CustomRequest {
  params: {
    bookshelfId: string;
  };
  body: {
    bookUniqueId: string;
  };
}

const addBook = async (req: AddBookRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      params: { bookshelfId },
      body: { bookUniqueId },
      user: { id: userId }
    } = req;

    if (!bookshelfId || !bookUniqueId) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf).findOne({ id: parsedBookshelfId, userId });
    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!bookshelf || !book) {
      throw new NotFoundError();
    }

    await getConnection()
      .createQueryBuilder()
      .relation(Bookshelf, 'books')
      .of(bookshelf)
      .add(book);

    res.status(201).json({
      success: true,
      message: null,
      result: {
        // 무슨 데이터를 더 줘야 할까?
        bookshelf
      }
    });
  } catch (error) {
    next(error);
  }
};

export default addBook;
