import { model } from "mongoose";
import productSchema from "./schemas/productSchema.js";

const Product = model("Product", productSchema);

export default Product;
