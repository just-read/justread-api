import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Bookshelf from '../../entities/bookshelf';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';

interface RemoveBookshelfRequest extends CustomRequest {
  body: {
    bookshelfId: string;
  };
}

const removeBookshelf = async (
  req: RemoveBookshelfRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      body: { bookshelfId },
      user: { id: userId }
    } = req;

    if (!bookshelfId) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf).findOne({
      id: parsedBookshelfId,
      userId
    });

    if (!bookshelf) {
      throw new NotFoundError('일치하는 정보를 찾을 수 없습니다.');
    }

    await getRepository(Bookshelf).delete({ id: bookshelf.id });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedBookshelf: bookshelf
      }
    });
  } catch (error) {
    next(error);
  }
};

export default removeBookshelf;
