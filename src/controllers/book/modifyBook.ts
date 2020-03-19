import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../libs/customErrors';

interface ModifyBookRequest extends Request {
  params: {
    bookId: string;
  };
  body: {
    title: string;
    isbn: string;
    description: string;
    year: number;
    authors: string;
  };
}

const modifyBook = async (
  req: ModifyBookRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      params: { bookId },
      body: { title, isbn, description, year, authors },
    } = req;

    if (!bookId || !title || !isbn || !authors) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const parsedBookId = parseInt(bookId, 10);

    const existingBook = await getRepository(Book).findOne(parsedBookId);

    if (!existingBook) {
      throw new NotFoundError('책 정보가 존재하지 않습니다.');
    }

    const modifiedBook = await getRepository(Book).update(parsedBookId, {
      title,
      isbn,
      description,
      year,
      authors,
    });
    res.status(200).json({
      success: true,
      message: null,
      result: { modifiedBook },
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBook;
