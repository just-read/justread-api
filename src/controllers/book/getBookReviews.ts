import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import Rating from '../../entities/rating';
import { NotFoundError } from '../../utils/customErrors';

interface GetBookReviewsRequest extends Request {
  params: {
    bookUniqueId: string;
  };
}

// 특정 책에 대한 다른 사람들의 별점과 평가들을 가져옴
const getBookReviews = async (
  req: GetBookReviewsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      params: { bookUniqueId }
    } = req;

    const book = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!book) {
      throw new NotFoundError();
    }

    const [reviews, count] = await getRepository(Rating)
      .createQueryBuilder('rating')
      .innerJoinAndSelect('rating.review', 'review')
      .where('ratind.bookId = :bookId', { bookId: book.id })
      .limit(10)
      .orderBy('rating.id', 'DESC')
      .getManyAndCount();

    res.status(200).json({
      success: true,
      message: null,
      result: {
        reviews,
        count
      }
    });
  } catch (error) {
    next(error);
  }
};

export default getBookReviews;
