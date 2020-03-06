import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Review from '../../entities/review';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../utils/customErrors';

interface RemoveBookReviewRequest extends Request {
  body: {
    reviewId: number;
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
      body: { reviewId },
    } = req;

    const review = await getRepository(Review).findOne({
      id: reviewId,
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
