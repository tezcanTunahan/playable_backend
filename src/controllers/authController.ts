import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername } from "../models/users";

type RegisterRequestDto = {
  username: string;
  password: string;
  role: string;
};

export const register = async (
  req: Request<{}, {}, RegisterRequestDto>,
  res: Response
) => {
  try {
    const { password, username, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username,
      password: hashedPassword,
      role,
    });
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

type LoginRequestDto = {
  username: string;
  password: string;
};

export const login = async (
  req: Request<{}, {}, LoginRequestDto>,
  res: Response
) => {
  try {
    const { password, username } = req.body;
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
