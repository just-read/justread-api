import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import User from '../../entities/user';
import Rating from '../../entities/rating';
import Review from '../../entities/review';
import Book from '../../entities/book';
import { InvalidParamError, NotFoundError } from '../../utils/errors';

interface GetProfile extends Request {
  params: {
    userId: string;
  };
}

const getProfile = async (req: GetProfile, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      params: { userId },
    } = req;

    if (!userId) {
      throw new InvalidParamError();
    }

    const parsedUserId = parseInt(userId, 10);

    const userInfo = await getRepository(User).findOne({ id: parsedUserId });

    if (!userInfo) {
      throw new NotFoundError();
    }

    const ratingCount = await getRepository(Rating)
      .createQueryBuilder('rating')
      .where('rating.userId = :userId', { userId: parsedUserId })
      .getCount();

    const reviewCount = await getRepository(Review)
      .createQueryBuilder('review')
      .where('review.userId = :userId', { userId: parsedUserId })
      .getCount();

    const recentRatedBooks = await getRepository(Book)
      .createQueryBuilder('book')
      .innerJoin('book.ratings', 'rating')
      .where('rating.userId = :userId', { userId: parsedUserId })
      .limit(3)
      .orderBy('rating.id', 'DESC')
      .getMany();

    // TODO: 프로필에 어떤 정보를 더 챙길지 고민이 필요함...
    res.status(200).json({
      success: true,
      message: null,
      result: {
        userInfo, // 유저 정보
        ratingCount, // 별점 갯수
        reviewCount, // 리뷰 갯수
        recentRatedBooks, // 최근 별점 평가한 책 목록
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getProfile;
