import { Request, Response, NextFunction } from 'express';

interface SearchBooksRequest extends Request {
  query: {
    q?: string;
  };
}

const searchBooks = async (
  req: SearchBooksRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    query: { q: searchQuery }
  } = req;
  if (searchQuery) {
    try {
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
};

export default searchBooks;
