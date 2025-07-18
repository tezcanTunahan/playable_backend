import CustomError from "../errors/CustomError";
import { NextFunction, Request, Response } from "express";
import { isNull } from "lodash";

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.code || 500).json({
    message: err.message,
    code: err.code,
    path: err.path,
    timestamp: err.timestamp,
    exception: err.exception,
    subCode: err.subCode,
  });
};

export const asyncErrorHandler = (func: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res);
    } catch (error) {
      let apiError = error as CustomError;
      if (isNull(apiError)) {
        apiError = new CustomError(500, "INTERNAL_SERVER_ERROR");
      }
      next(apiError);
    }
  };
};
