import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema({
    id: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Product",
    },
    quantity: {
        type: Number,
        require: true,
    },
    size: {
        type: String,
        require: true,
    }
});

const addressSchema = new Schema({
    street: {
        type: String,
        require: true,
    },
    number: {
        type: String,
        require: true,
    },
    city: {
        type: String,
        require: true,
    },
    state: {
        type: String,
        require: true,
    },
    country: {
        type: String,
        require: true,
    },
    zipCode: {
        type: String,
        require: true,
    },
});

const orderSchema = new Schema({
    client: {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "Client",
    },
    products: {
        type: [productsSchema],
        require: true,
    },
    status: {
        type: String,
        require: true,
        enum: ["pending", "approved", "completed", "cancelled"],
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: null,
    },
    address: {
        type: addressSchema,
        require: true,
    }
});

export default orderSchema;
