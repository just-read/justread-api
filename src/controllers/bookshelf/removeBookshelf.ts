import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/errors';

interface RemoveBookshelfRequest extends Request {
  params: {
    bookshelfId: string;
  };
}

const removeBookshelf = async (
  req: RemoveBookshelfRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { bookshelfId },
      user: { id: userId },
    } = req;

    if (!bookshelfId) {
      throw new InvalidParamError();
    }

    const parsedBookshelfId = parseInt(bookshelfId, 10);

    const bookshelf = await getRepository(Bookshelf).findOne({
      id: parsedBookshelfId,
      userId,
    });

    if (!bookshelf) {
      throw new NotFoundError();
    }

    await getRepository(Bookshelf).delete({ id: bookshelf.id });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        removedBookshelf: bookshelf,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default removeBookshelf;
