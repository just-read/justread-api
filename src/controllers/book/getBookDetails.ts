import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { NotFoundError } from '../../libs/customErrors';

interface GetBookDetailsRequest extends Request {
  params: {
    bookId: string;
  };
}

const getBookDetails = async (
  req: GetBookDetailsRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      params: { bookId },
    } = req;

    const bookInfo = await getRepository(Book).findOne(bookId);

    if (!bookInfo) {
      throw new NotFoundError();
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookDetails: bookInfo,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getBookDetails;
