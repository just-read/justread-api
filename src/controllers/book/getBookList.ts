import { Request, Response } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

export enum GetType {
  RECENT = 'recent',
  POPULAR = 'popular'
}

interface GetBookListRequest extends Request {
  params: {
    type: GetType.RECENT | GetType.POPULAR;
  };
}

const getBookList = async (req: GetBookListRequest, res: Response): Promise<Response> => {
  const {
    params: { type = GetType.RECENT }
  } = req;

  const getRecentBookList = async (): Promise<[Book[], number]> =>
    Book.findAndCount({
      take: 10,
      order: {
        id: 'DESC'
      }
    });

  if (Object.values(GetType).includes(type)) {
    throw new InvalidParamError('type이 올바르지 않습니다.');
  }

  const bookItems = await getRecentBookList();

  return res.status(200).json({
    success: true,
    message: null,
    result: {
      bookItems
    }
  });
};

export default getBookList;
