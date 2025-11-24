import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/customError.js";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

export const asyncErrorHandler =
  (func: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
