import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    stock: { type: Number, required: true },
    imgUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", ProductSchema);
