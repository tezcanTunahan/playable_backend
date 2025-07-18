import { userRepo } from "../repository/userRepo";
import CustomError from "../errors/CustomError";
import { RegisterRequestDto } from "./authService";
import bcrypt from "bcryptjs";

const userService = {
  getUserByUsername: async (username: string) => {
    const user = await userRepo.getUserByUsername(username);
    if (!user) throw new CustomError(404, "User not found");
    return user;
  },

  createUser: async (registerRequestDto: RegisterRequestDto) => {
    const hashedPassword = await bcrypt.hash(registerRequestDto.password, 10);

    await userRepo.createUser({
      username: registerRequestDto.username,
      password: hashedPassword,
      role: registerRequestDto.role,
    });
  },
};

export default userService;
