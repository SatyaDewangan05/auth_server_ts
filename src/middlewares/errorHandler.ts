import { Request, Response, NextFunction } from 'express';

interface Error {
  status?: number;
  message?: string;
  stack?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};

export default errorHandler;
