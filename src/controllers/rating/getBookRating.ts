import { Response, NextFunction } from 'express';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError } from '../../utils/customErrors';

interface GetBookRatingRequest extends CustomRequest {}

// 특정 책에 대한 자신의 평가를 가져옴
const getBookRating = async (
  req: GetBookRatingRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다.');
    }

    res.status(200).json({
      success: true,
      message: null,
      result: {}
    });
  } catch (error) {
    next(error);
  }
};

export default getBookRating;
