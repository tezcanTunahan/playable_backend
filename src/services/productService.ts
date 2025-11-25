import Product from "../entitiy/Product.js";
import { ProductRequestDto } from "../dtos/request/productRequestDto.js";
import { CustomError } from "../errors/customError.js";

export const createProduct = async (productRequestDto: ProductRequestDto) => {
  const newProduct = new Product(productRequestDto);
  await newProduct.save();
};

export const updateProduct = async (
  productRequestDto: ProductRequestDto,
  id?: string
) => {
  if (!id) throw new CustomError(400, "id not found!!");
  const product = await getProductById(id);
  product.title = productRequestDto.title;
  product.desc = productRequestDto.desc;
  product.price = productRequestDto.price;
  product.stock = productRequestDto.stock;
  product.imgUrl = productRequestDto.imgUrl;
  await product.save();
};

export const deleteProduct = async (id?: string) => {
  if (!id) throw new CustomError(400, "id not found!!");
  await Product.deleteOne({ _id: id });
};

export const getProductById = async (id?: string) => {
  if (!id) throw new CustomError(400, "id not found!!");
  const product = await Product.findById(id);
  if (!product) throw new CustomError(404, "Product not found!");
  return product;
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
