import { model } from "mongoose";
import clientSchema from "./schemas/clientSchema.js";

const Client = model("Client", clientSchema);

export default Client;
