import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Bookshelf from '../../entities/bookshelf';
import User from '../../entities/user';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../libs/customErrors';

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

    const { id: userId } = req.user as User;
    const {
      params: { bookshelfId },
      body: { name: bookshelfName },
    } = req;

    if (!bookshelfId || !bookshelfName) {
      throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
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
