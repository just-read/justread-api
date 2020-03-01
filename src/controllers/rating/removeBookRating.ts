import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';
import { getRepository } from 'typeorm';
import Rating from '../../entities/rating';

interface RemoveBookRatingRequest extends CustomRequest {
  body: {
    ratingId: number;
  };
}

const removeRating = async (
  req: RemoveBookRatingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      body: { ratingId },
      user: { id: userId }
    } = req;

    if (!ratingId) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
    }

    const rating = await getRepository(Rating).findOne({ id: ratingId, userId });

    if (!rating) {
      throw new NotFoundError('별점 정보가 존재하지 않습니다.');
    }

    await getRepository(Rating).remove(rating);

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedRating: rating
      }
    });
  } catch (error) {
    next(error);
  }
};

export default removeRating;
