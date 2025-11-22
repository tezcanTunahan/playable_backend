import { z } from "zod";

export const LoginRequestDtoSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});
export type LoginRequestDto = z.infer<typeof LoginRequestDtoSchema>;
