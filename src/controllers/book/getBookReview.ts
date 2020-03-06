import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import Rating from '../../entities/rating';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../libs/customErrors';

interface GetBookReviewRequest extends Request {
  params: {
    bookUniqueId: string;
  };
}

// 특정 책에 대한 자신의 별점과 평가를 가져옴
const getBookReview = async (
  req: GetBookReviewRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const user = req.user as User;
    const {
      params: { bookUniqueId },
    } = req;

    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!book) {
      throw new NotFoundError();
    }

    const bookReview = await getRepository(Rating)
      .createQueryBuilder('rating')
      .leftJoinAndSelect('rating.review', 'review')
      .where('rating.bookId = :bookId', { bookId: book.id })
      .andWhere('rating.userId = :userId', { userId: user.id })
      .getOne();

    res.status(200).json({
      success: true,
      message: null,
      result: {
        review: bookReview || null, // 결과를 이렇게 줘도 되나...
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getBookReview;
