import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Review from '../../entities/review';
import User from '../../entities/user';
import { UnauthorizedError, NotFoundError } from '../../libs/customErrors';

interface ModifyBookReviewRequest extends Request {
  body: {
    reviewId: number;
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
      body: { reviewId, reviewContent },
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
        updatedReview: { ...review, content: reviewContent },
      },
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBookReview;
