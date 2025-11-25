import { z } from "zod";

export const ProductRequestDtoSchema = z.object({
  title: z.string(),
  desc: z.string(),
  imgUrl: z.string(),
  stock: z.number(),
  price: z.number(),
});
export type ProductRequestDto = z.infer<typeof ProductRequestDtoSchema>;
