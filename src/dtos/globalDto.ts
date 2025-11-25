import z from "zod";
import { RoleDto } from "./request/registerRequestDto.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      role: RoleDto;
    }
    interface Request {
      user?: User;
    }
  }
}

export const CategoryDtoSchema = z.enum(["tech", "food", "books"]);
export type CategoryDto = z.infer<typeof CategoryDtoSchema>;
