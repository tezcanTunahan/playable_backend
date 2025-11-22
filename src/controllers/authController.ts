import type { Request, Response } from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request<{}, {}, { username: string; password: string; role: string }>,
  res: Response
) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username,
    password: hashedPassword,
    role,
  });
  try {
    await newUser.save();
  } catch (error) {
    throw new Error("register error");
  }
  res
    .status(201)
    .json({ message: "User registered with username: " + username });
};

export const login = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("user not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("password dont match");
  const secret = process.env.JWT_SECRET || ""; // fix it
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "1h",
  });
  res.status(200).json({ token });
};
