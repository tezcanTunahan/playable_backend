import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "../models/users";
import CustomError from "../errors/CustomError";

type RegisterRequestDto = {
  username: string;
  password: string;
  role: string;
};

export const register = async (
  req: Request<{}, {}, RegisterRequestDto>,
  res: Response
) => {
  const { password, username, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await createUser({
    username,
    password: hashedPassword,
    role,
  });
  res.status(201).json({
    message: "User registered successfully",
  });
};

type LoginRequestDto = {
  username: string;
  password: string;
};

export const login = async (
  req: Request<{}, {}, LoginRequestDto>,
  res: Response
) => {
  const { password, username } = req.body;

  const user = await getUserByUsername(username);
  if (!user) throw new CustomError(404, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError(404, "invalid credentials");

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.status(200).json({
    accessToken,
  });
};
