import { z } from "zod";

export const RoleDtoSchema = z.enum(["user", "admin"]);
export type RoleDto = z.infer<typeof RoleDtoSchema>;

export const RegisterDtoSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
