import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';
import Rating from '../../entities/rating';

interface SetBookRatingRequest extends CustomRequest {
  body: {
    bookUniqueId: string;
    rating: number;
  };
}

const setBookRating = async (
  req: SetBookRatingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      body: { bookUniqueId, rating },
      user: { id: userId }
    } = req;

    if (!bookUniqueId || !rating) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
    }

    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!book) {
      throw new NotFoundError('책 정보가 존재하지 않습니다.');
    }

    const newRating = await Rating.create({ userId, bookId: book.id, rating }).save();

    res.status(201).json({
      success: true,
      message: null,
      result: {
        newRating
      }
    });
  } catch (error) {
    next(error);
  }
};

export default setBookRating;
