import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    active: { type: Boolean, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true, enum: ["tech", "food", "books"] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
