import { CartRequestDto } from "../dtos/request/cartRequsetDto.js";
import Cart from "../entitiy/Cart.js";

export const createCart = async (
  userId: string,
  cartRequestDto: CartRequestDto
) => {
  const { productId, quantity } = cartRequestDto;

  await Cart.findOneAndUpdate(
    {
      userId,
      product: productId,
    },
    { quantity },
    { upsert: true, new: true }
  );
};

export const getCartByUserId = async (userId: string) => {
  return await Cart.find({ userId }).populate({
    path: "product",
    select: "title imgUrl price desc category _id",
  });
};

export const deleteCart = async (userId: string, productId: string) => {
  await Cart.deleteOne({ userId, product: productId });
};
