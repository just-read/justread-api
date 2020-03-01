import { Response, NextFunction } from 'express';
import Book from '../../entities/book';
import { InvalidParamError, UnauthorizedError } from '../../utils/customErrors';
import { CustomRequest } from '../../utils/auth';
import { isISBN } from '../../utils/validation';

interface AddNewBookRequest extends CustomRequest {
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
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다.');
    }

    const {
      body: { title, isbn, description, year, authors }
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
        newBook
      }
    });
  } catch (error) {
    next(error);
  }
};

export default addNewBook;
