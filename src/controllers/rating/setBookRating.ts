import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import Rating from '../../entities/rating';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../libs/customErrors';

interface SetBookRatingRequest extends Request {
  body: {
    bookUniqueId: string;
    rating: number;
  };
}

const setBookRating = async (
  req: SetBookRatingRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const { id: userId } = req.user as User;
    const {
      body: { bookUniqueId, rating },
    } = req;

    if (!bookUniqueId || !rating) {
      throw new InvalidParamError();
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
        newRating,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default setBookRating;
