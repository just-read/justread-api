import { Request, Response } from 'express';

interface GetBookDetailsRequest extends Request {
  params: {
    bookId: string;
  };
}

const getBookDetails = async (req: GetBookDetailsRequest, res: Response): Promise<Response> => {
  const {
    params: { bookId }
  } = req;

  return res.status(200).json({
    success: true,
    result: {
      bookDetails: {}
    }
  });
};

export default getBookDetails;
