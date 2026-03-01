import rateLimit from "express-rate-limit";

// general API limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max requests per IP
  message: {
    message: "Too many requests. Please try again later.",
  },
});

// stricter login limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});