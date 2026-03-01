import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err.message);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
  });
};