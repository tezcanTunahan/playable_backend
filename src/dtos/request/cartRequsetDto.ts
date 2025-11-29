import z from "zod";

export const CartRequestDtoSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export type CartRequestDto = z.infer<typeof CartRequestDtoSchema>;
