import { ProductModal } from "../model/products";

export const productRepo = {
  createProduct: (values: Record<string, any>) =>
    new ProductModal(values).save().then((product) => product.toObject()),
};
