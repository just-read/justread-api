import { Request, Response } from 'express';
import Book from '../../entities/book';
import { InvalidParamError } from '../../utils/customErrors';

export enum BookListType {
  RECENT,
  POPULAR
}

type BookListStrings = keyof typeof BookListType;

interface GetBookListRequest extends Request {
  params: {
    type: BookListStrings;
  };
}

const getBookList = async (req: GetBookListRequest, res: Response): Promise<Response> => {
  const {
    params: { type = BookListType[BookListType.RECENT] }
  } = req;

  const getRecentBookList = async (): Promise<[Book[], number]> =>
    Book.findAndCount({
      take: 10,
      order: {
        id: 'DESC'
      }
    });

  if (Object.keys(BookListType).includes(type)) {
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
