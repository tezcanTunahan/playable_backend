import type { Request, Response, NextFunction } from "express";
import { RoleDto } from "../dtos/request/registerRequestDto.js";
import { CustomError } from "../errors/customError.js";

export const authorizeRoles = (...allowedRoles: RoleDto[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new CustomError(3, "Unauthorized access denied!");
    }
    next();
  };
};
