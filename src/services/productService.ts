import Product from "../entitiy/Product.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";

export const createProduct = async (productRequestDto: ProductRequestDto) => {
  const newProduct = new Product(productRequestDto);
  await newProduct.save();
};
