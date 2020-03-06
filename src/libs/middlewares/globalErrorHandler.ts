import { Request, Response, NextFunction } from 'express';

const globalErrorHandler = (error: Error, req: Request, res: Response, _: NextFunction): void => {
  console.error(error);
  if ('status' in error) {
    res.status(error['status']);
  } else {
    res.status(500);
  }
  res.json({
    success: false,w
    message: error.message,
    result: null,
  });
};

export { globalErrorHandler };
