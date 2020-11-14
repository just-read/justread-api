import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Bookshelf from '../../entities/bookshelf';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/errors';

interface ModifyBookshelfRequest extends Request {
  params: {
    bookshelfId: string;
  };
  body: {
    name: string;
  };
}

const modifyBookshelf = async (
  req: ModifyBookshelfRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 없습니다.');
    }

    const {
      params: { bookshelfId },
      body: { name: bookshelfName },
      user: { id: userId },
    } = req;

    if (!bookshelfId || !bookshelfName) {
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

    await getRepository(Bookshelf).update({ id: bookshelf.id }, { name: bookshelfName });

    res.status(200).json({
      success: true,
      message: null,
      result: {
        updatedBookshelf: bookshelf,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBookshelf;
