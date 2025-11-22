import { z } from "zod";

const role = z.enum(["user", "admin"]);

export const RegisterDtoSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role,
});
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
