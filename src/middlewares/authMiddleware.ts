import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
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
    throw res.status(401).json("no token auth denied");
  }
  try {
    const secret = process.env.JWT_SECRET || ""; // fix it;
    const decode = jwt.verify(token, secret);
    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {}
};
