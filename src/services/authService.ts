import jwt from "jsonwebtoken";
import { RegisterDto } from "../dtos/request/registerRequestDto.js";
import User from "../entitiy/userModel.js";
import bcrypt from "bcryptjs";
import { LoginRequestDto } from "../dtos/request/loginRequestDto.js";

export const register = async (registerDto: RegisterDto) => {
  const hashedPassword = await bcrypt.hash(registerDto.password, 10);
  const newUser = new User({
    username: registerDto.username,
    password: hashedPassword,
    role: registerDto.role,
  });
  try {
    await newUser.save();
  } catch (error) {
    throw new Error("register error");
  }
};

export const login = async (loginRequestDto: LoginRequestDto) => {
  const user = await User.findOne({ username: loginRequestDto.username });
  if (!user) {
    throw new Error("user not found");
  }
  const isMatch = await bcrypt.compare(loginRequestDto.password, user.password);
  if (!isMatch) throw new Error("password dont match");
  const secret = process.env.JWT_SECRET || ""; // fix it
  const token = jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: "1h",
  });
  return token;
};
