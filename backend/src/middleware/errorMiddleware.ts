import { Request, Response, NextFunction } from 'express';
import Log from '../models/Log';

const errorMiddleware = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); 
  const log = new Log({
    message: err.message,
    stack: err.stack,
  });

  try {
    await log.save();
  } catch (saveError) {
    console.error('Failed to save error log:', saveError);
  }

  res.status(500).json({
    message: err.message || 'Server Error',
  });
};

export default errorMiddleware;
