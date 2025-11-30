import Order from "../entitiy/Order.js";
import Cart from "../entitiy/Cart.js";
import Product from "../entitiy/Product.js";

//  TODO: make it transaction
export const createOrder = async (userId: string) => {
  const cartItems = await Cart.find({ userId });
  if (!cartItems.length) throw new Error("empty cart...");
  const orders = cartItems.map((item) => {
    return {
      userId: item.userId,
      product: item.product,
      quantity: item.quantity,
    };
  });

  await Order.insertMany(orders);
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(
      item.product,
      { $inc: { stock: -item.quantity } },
      { new: true }
    );
  }
  await Cart.deleteMany({ userId });
  return orders;
};

export const getOrdersByUserId = async (userId: string) => {
  return await Order.find({ userId }).populate("product");
};

export const getOrders = async () => {
  return await Order.find();
};
