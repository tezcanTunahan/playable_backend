import Order from "../entitiy/Order.js";
import Cart from "../entitiy/Cart.js";

//  TODO: make it transaction
export const createOrder = async (userId: string) => {
  const cartItems = await Cart.find({ userId });
  if (!cartItems.length) throw new Error("empty cart...");
  const orders = cartItems.map((item) => ({
    userId: item.userId,
    product: item.product,
    quantity: item.quantity,
  }));
  await Order.insertMany(orders);
  await Cart.deleteMany({ userId });
  return orders;
};
