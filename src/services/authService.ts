import jwt from "jsonwebtoken";
import { RegisterDto } from "../dtos/request/registerRequestDto.js";
import bcrypt from "bcryptjs";
import { LoginRequestDto } from "../dtos/request/loginRequestDto.js";
import { createUser, getUserByUsername } from "./userService.js";

export const register = async (registerDto: RegisterDto) => {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  await createUser({
    username: registerDto.username,
    password: hashedPassword,
  });
};

export const login = async (loginRequestDto: LoginRequestDto) => {
  const user = await getUserByUsername(loginRequestDto.username);
  const isMatch = await bcrypt.compare(loginRequestDto.password, user.password);
  if (!isMatch) throw new Error("password dont match");
  const secret = process.env.JWT_SECRET || ""; // fix it laatterrrr
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "30d",
  });
  return token;
};
