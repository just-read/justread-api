import { CustomRequest } from '../../utils/auth';
import { Response, NextFunction } from 'express';
import { UnauthorizedError, NotFoundError } from '../../utils/customErrors';
import { getRepository } from 'typeorm';
import Review from '../../entities/review';

interface ModifyBookReviewRequest extends CustomRequest {
  body: {
    reviewId: number;
    reviewContent: string;
  };
}

const modifyBookReview = async (
  req: ModifyBookReviewRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const {
      body: { reviewId, reviewContent },
      user: { id: userId }
    } = req;

    const review = await getRepository(Review).findOne({ id: reviewId, userId });

    if (!review) {
      throw new NotFoundError();
    }

    await getRepository(Review).update({ id: reviewId }, { content: reviewContent });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        updatedReview: { ...review, content: reviewContent }
      }
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBookReview;
