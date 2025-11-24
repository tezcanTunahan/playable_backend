import { RegisterDto, RoleDto } from "../dtos/request/registerRequestDto.js";
import User from "../entitiy/User.js";
import { CustomError } from "../errors/customError.js";

export const getUserByUsername = async (username: string) => {
  const user = await User.findOne({ username });
  if (!user) throw new CustomError(404, "user not found!!!");
  return user;
};

export const createUser = async (registerDto: RegisterDto) => {
  const newUser = new User({
    username: registerDto.username,
    password: registerDto.password,
    role: "user" as RoleDto,
  });
  await newUser.save();
};
