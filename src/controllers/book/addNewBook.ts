import { Request, Response } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

interface AddNewBookRequest extends Request {
  body: {
    title: string;
    description: string;
    year: number;
  };
}

const addNewBook = async (req: AddNewBookRequest, res: Response): Promise<Response> => {
  const {
    body: { title, description, year }
  } = req;

  if (!title || !description || !year) {
    throw new InvalidParamError('필요한 정보가 누락되었습니다.');
  }

  const newBook = await Book.create({ title, description, year }).save();
  return res.status(201).json({
    success: true,
    message: null,
    result: {
      bookInfo: newBook
    }
  });
};

export default addNewBook;
