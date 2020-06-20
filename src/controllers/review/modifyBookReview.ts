import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Review from '../../entities/review';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../utils/errors';

interface ModifyBookReviewRequest extends Request {
  params: {
    reviewId: string;
  };
  body: {
    reviewContent: string;
  };
}

const modifyBookReview = async (
  req: ModifyBookReviewRequest,
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
      body: { reviewContent },
    } = req;

    const parsedReviewId = parseInt(reviewId, 10);

    const review = await getRepository(Review).findOne({ id: parsedReviewId, userId });

    if (!review) {
      throw new NotFoundError();
    }

    await getRepository(Review).update({ id: parsedReviewId }, { content: reviewContent });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        updatedReview: { ...review, content: reviewContent },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBookReview;
