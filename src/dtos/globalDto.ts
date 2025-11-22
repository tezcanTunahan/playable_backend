import { RoleDto } from "./request/registerRequestDto.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: RoleDto;
    }
    interface Request {
      user: User;
    }
  }
}
