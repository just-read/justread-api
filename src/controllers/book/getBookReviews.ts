import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../utils/auth';

interface GetBookReviewsRequest extends CustomRequest {}

// 특정 책에 대한 다른 사람들의 별점과 평가들을 가져옴
const getBookReviews = async (
  req: GetBookReviewsRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      message: null,
      result: {}
    });
  } catch (error) {
    next(error);
  }
};

export default getBookReviews;
