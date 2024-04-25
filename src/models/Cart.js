import cartSchema from "./schemas/cartSchema.js";
import mongoose from "mongoose";

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;