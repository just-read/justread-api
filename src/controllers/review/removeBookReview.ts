import { CustomRequest } from '../../utils/auth';
import { Response, NextFunction } from 'express';
import { UnauthorizedError, NotFoundError } from '../../utils/customErrors';
import Review from '../../entities/review';
import { getRepository } from 'typeorm';

interface RemoveBookReviewRequest extends CustomRequest {
  body: {
    reviewId: number;
  };
}

const removeBookReview = async (
  req: RemoveBookReviewRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      body: { reviewId },
      user: { id: userId }
    } = req;

    const review = await getRepository(Review).findOne({
      id: reviewId,
      userId
    });

    if (!review) {
      throw new NotFoundError();
    }

    await getRepository(Review).remove(review);

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedReview: review
      }
    });
  } catch (error) {
    next(error);
  }
};

export default removeBookReview;
