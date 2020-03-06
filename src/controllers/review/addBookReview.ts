import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import Rating from '../../entities/rating';
import Review from '../../entities/review';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../utils/customErrors';

interface AddBookReviewRequest extends Request {
  body: {
    bookUniqueId: string;
    reviewContent: string;
  };
}

const addBookReview = async (
  req: AddBookReviewRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id: userId } = req.user as User;
    const {
      body: { bookUniqueId, reviewContent },
    } = req;

    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!book) {
      throw new NotFoundError();
    }

    /**
     * 해당 책의 별점이 존재하는지 먼저 확인하고
     * 별점이 있으면 별점의 ratingId를 가지는 리뷰 생성
     * 별점이 없으면 에러 반환
     */

    const rating = await getRepository(Rating).findOne({ bookId: book.id, userId });

    if (!rating) {
      throw new NotFoundError('해당 책의 별점을 찾을 수 없습니다.');
    }
    // 별점이 존재하므로 별점의 ratingId를 가지는 리뷰 생성
    const newReview = await Review.create({
      userId,
      bookId: book.id,
      ratingId: rating.id,
      content: reviewContent,
    }).save();

    res.status(201).json({
      success: true,
      message: null,
      result: {
        newReview,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default addBookReview;
