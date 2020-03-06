import { Request, Response, NextFunction } from 'express';
import Book from '../../entities/book';
import { InvalidParamError, UnauthorizedError } from '../../libs/customErrors';
import { isISBN } from '../../libs/validation';

interface AddNewBookRequest extends Request {
  body: {
    title: string;
    isbn: string;
    description: string;
    year: number;
    authors: string;
  };
}

const addNewBook = async (
  req: AddNewBookRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      body: { title, isbn, description, year, authors },
    } = req;

    if (!title || !isbn || !authors) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    if (!isISBN(isbn)) {
      throw new InvalidParamError('유효하지 않은 ISBN입니다.');
    }

    const newBook = await Book.create({ title, isbn, description, year, authors }).save();
    res.status(201).json({
      success: true,
      message: null,
      result: {
        newBook,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default addNewBook;
