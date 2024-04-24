import { model } from "mongoose";
import adminSchema from "./schemas/adminSchema.js";

const Admin = model("Admin", adminSchema);

export default Admin;
