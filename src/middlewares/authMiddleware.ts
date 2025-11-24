import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RoleDto } from "../dtos/request/registerRequestDto.js";
import { CustomError } from "../errors/customError.js";

interface JwtPayload {
  id: string;
  role: RoleDto;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  let authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    throw new CustomError(401, "no token auth");
  }
  try {
    const secret = process.env.JWT_SECRET || ""; // fix it;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    throw new CustomError(401, "auth denied: " + error);
  }
};
