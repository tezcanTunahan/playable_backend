import { Request, Response } from "express";
import userService from "./userService";
import { RegisterRequestDto, LoginRequestDto } from "../dto/authDto";
import { createAccesToken, passwordMatchCheker } from "../helpers/auth";

export const register = async (
  req: Request<{}, {}, RegisterRequestDto>,
  res: Response
) => {
  await userService.createUser(req.body);
  res.status(201).json({
    message: "User registered successfully",
  });
};

export const login = async (
  req: Request<{}, {}, LoginRequestDto>,
  res: Response
) => {
  const { password, username } = req.body;
  const user = await userService.getUserByUsername(username);
  passwordMatchCheker(password, user.password);
  const accessToken = createAccesToken(user._id, user.role);
  res.status(200).json({ accessToken });
};
