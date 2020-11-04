import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Rating from '../../entities/rating';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/errors';

interface RemoveBookRatingRequest extends Request {
  params: {
    ratingId: string;
  };
}

const removeRating = async (
  req: RemoveBookRatingRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { ratingId },
      user: { id: userId },
    } = req;

    if (!ratingId) {
      throw new InvalidParamError();
    }

    const parsedRatingId = parseInt(ratingId, 10);

    const rating = await getRepository(Rating).findOne({ id: parsedRatingId, userId });

    if (!rating) {
      throw new NotFoundError('별점 정보가 존재하지 않습니다.');
    }

    await getRepository(Rating).remove(rating);

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedRating: rating,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default removeRating;
