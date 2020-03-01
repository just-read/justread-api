import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { NotFoundError } from '../../utils/customErrors';

interface GetBookDetailsRequest extends Request {
  params: {
    bookUniqueId: string;
  };
}

const getBookDetails = async (
  req: GetBookDetailsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      params: { bookUniqueId }
    } = req;

    const bookInfo = await getRepository(Book).findOne({
      uniqueId: bookUniqueId
    });

    if (!bookInfo) {
      throw new NotFoundError('일치하는 정보를 찾을 수 없습니다.');
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {
        bookDetails: bookInfo
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookDetails;
