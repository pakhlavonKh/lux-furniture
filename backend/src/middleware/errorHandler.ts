import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack })
  });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
