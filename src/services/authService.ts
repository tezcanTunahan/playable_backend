import userService from "./userService";
import { RegisterRequestDto, LoginRequestDto } from "../dto/authDto";
import { createAccesToken, passwordMatchCheker } from "../helpers/auth";

const authService = {
  register: async (registerRequestDto: RegisterRequestDto) => {
    await userService.createUser(registerRequestDto);
  },

  login: async (loginRequestDto: LoginRequestDto) => {
    const user = await userService.getUserByUsername(loginRequestDto.username);
    await passwordMatchCheker(loginRequestDto.password, user.password);
    return createAccesToken(user._id, user.role, user.username);
  },
};

export default authService;
