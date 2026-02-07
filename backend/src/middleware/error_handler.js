export const error_handler = (err, req, res, next) => {
  const status_code = err.status_code || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    status_code,
    message,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  res.status(status_code).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: err.stack }),
  });
};

export const async_handler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
