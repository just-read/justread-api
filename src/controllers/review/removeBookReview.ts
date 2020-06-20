import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Review from '../../entities/review';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

interface RemoveBookReviewRequest extends Request {
  params: {
    reviewId: string;
  };
}

const removeBookReview = async (
  req: RemoveBookReviewRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { id: userId } = req.user as User;
    const {
      params: { reviewId },
    } = req;

    const parsedReviewId = parseInt(reviewId, 10);

    const review = await getRepository(Review).findOne({
      id: parsedReviewId,
      userId,
    });

    if (!review) {
      throw new NotFoundError();
    }

    await getRepository(Review).remove(review);

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedReview: review,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default removeBookReview;
