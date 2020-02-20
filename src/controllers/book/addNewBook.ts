import { Request, Response, NextFunction } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

interface AddNewBookRequest extends Request {
  body: {
    title: string;
    description: string;
    year: number;
  };
}

const addNewBook = async (
  req: AddNewBookRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      body: { title, description, year }
    } = req;

    if (!title || !description || !year) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const newBook = await Book.create({ title, description, year }).save();
    res.status(201).json({
      success: true,
      message: null,
      result: {
        bookInfo: newBook
      }
    });
  } catch (error) {
    next(error);
  }
};

export default addNewBook;
