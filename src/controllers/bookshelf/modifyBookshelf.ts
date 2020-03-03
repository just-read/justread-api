import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';
import Bookshelf from '../../entities/bookshelf';

interface ModifyBookshelfRequest extends CustomRequest {
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
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('인증 정보가 없습니다.');
  }

  const {
    params: { bookshelfId },
    user: { id: userId },
    body: { name: bookshelfName }
  } = req;

  if (!bookshelfId || !bookshelfName) {
    throw new InvalidParamError('필요한 정보가 존재하지 않습니다.');
  }

  const parsedBookshelfId = parseInt(bookshelfId, 10);

  const bookshelf = await getRepository(Bookshelf).findOne({
    id: parsedBookshelfId,
    userId
  });

  if (!bookshelf) {
    throw new NotFoundError();
  }

  await getRepository(Bookshelf).update({ id: bookshelf.id }, { name: bookshelfName });

  res.status(200).json({
    success: true,
    message: null,
    result: {
      updatedBookshelf: bookshelf
    }
  });
};

export default modifyBookshelf;
