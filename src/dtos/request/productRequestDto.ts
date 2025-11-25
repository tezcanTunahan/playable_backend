import { z } from "zod";
import { CategoryDtoSchema } from "../globalDto.js";

export const ProductRequestDtoSchema = z.object({
  title: z.string(),
  desc: z.string(),
  active: z.boolean(),
  imgUrl: z.string(),
  stock: z.number(),
  price: z.number(),
  category: CategoryDtoSchema,
});
export type ProductRequestDto = z.infer<typeof ProductRequestDtoSchema>;
