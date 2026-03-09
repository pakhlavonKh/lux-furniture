// backend/src/middleware/error_handler.js
export const error_handler = (err, req, res, next) => {
  const status_code = err.status_code || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const error_payload = {
    status_code,
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === "development") {
    error_payload.stack = err.stack;
  }

  console.error("[ERROR]", error_payload);

  res.status(status_code).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

export const async_handler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};