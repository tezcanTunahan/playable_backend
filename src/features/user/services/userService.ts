import { userRepo } from "../repository/userRepo";
import CustomError from "../../../errors/CustomError";
import { RegisterRequestDto } from "../../auth/dto/authDto";
import bcrypt from "bcryptjs";

const userService = {
  createUser: async (registerRequestDto: RegisterRequestDto) => {
    const hashedPassword = await bcrypt.hash(registerRequestDto.password, 10);

    await userRepo.createUser({
      username: registerRequestDto.username,
      password: hashedPassword,
      role: registerRequestDto.role,
    });
  },

  getUserById: async (userId: string) => {
    const user = await userRepo.getUserById(userId);
    if (!user) throw new CustomError(404, "User not found");
    return user;
  },

  getUserByUsername: async (username: string) => {
    const user = await userRepo.getUserByUsername(username);
    if (!user) throw new CustomError(404, "User not found");
    return user;
  },
};

export default userService;
