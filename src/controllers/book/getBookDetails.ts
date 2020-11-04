import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from 'entities/book';
import { NotFoundError } from 'utils/errors';

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

    const parsedBookId = parseInt(bookId, 10);

    const bookInfo = await getRepository(Book).findOne(parsedBookId);

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
