import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema({
    client: {
        type: mongoose.Types.ObjectId,
        ref: "Client",
        require: true,
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default cartSchema