import { Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import Book from '../../entities/book';
import { CustomRequest } from '../../utils/auth';
import { UnauthorizedError, InvalidParamError, NotFoundError } from '../../utils/customErrors';

interface ModifyBookRequest extends CustomRequest {
  body: {
    bookUniqueId: string;
    title: string;
    isbn: string;
    description: string;
    year: number;
    authors: string;
  };
}

const modifyBook = async (
  req: ModifyBookRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증 정보가 존재하지 않습니다.');
    }

    const {
      body: { bookUniqueId, title, isbn, description, year, authors }
    } = req;

    if (!bookUniqueId || !title || !isbn || !authors) {
      throw new InvalidParamError('필요한 정보가 누락되었습니다.');
    }

    const existingBook = await getRepository(Book).findOne({ uniqueId: bookUniqueId });

    if (!existingBook) {
      throw new NotFoundError('책 정보가 존재하지 않습니다.');
    }

    const modifiedBook = await getRepository(Book).update(
      { uniqueId: bookUniqueId },
      {
        title,
        isbn,
        description,
        year,
        authors
      }
    );
    res.status(200).json({
      success: true,
      message: null,
      result: { modifiedBook }
    });
  } catch (error) {
    next(error);
  }
};

export default modifyBook;
