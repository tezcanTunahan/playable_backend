import Product from "../entitiy/Product.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";

export const createProduct = async (productRequestDto: ProductRequestDto) => {
  const newProduct = new Product(productRequestDto);
  await newProduct.save();
};

export const getProdcuts = async (page: number, pageSize: number) => {
  const products = await Product.find()
    .skip((page - 1) * pageSize)
    .limit(pageSize);
  const totalElements = await Product.countDocuments();
  return {
    data: products,
    totalElements,
    page,
    pageSize,
  };
};
