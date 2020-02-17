import { Request, Response } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

export enum EnumBookListType {
  RECENT = 'recent',
  POPULAR = 'popular',
  RECOMMEND = 'recomend'
}

type BookListStrings = keyof typeof EnumBookListType;

interface GetBookListRequest extends Request {
  query: {
    type: BookListStrings;
  };
}

const getBookList = async (req: GetBookListRequest, res: Response): Promise<Response> => {
  const {
    query: { type = EnumBookListType.RECENT }
  } = req;

  const getRecentBookList = async (): Promise<[Book[], number]> =>
    Book.findAndCount({
      take: 10,
      order: {
        id: 'DESC'
      }
    });

  if (!(type in EnumBookListType)) {
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
