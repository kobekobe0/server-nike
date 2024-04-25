import { Schema } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        required: true,
        enum: ['casual', 'basketball', 'skateboard', 'running']
    },
    sex: {
        type: String,
        required: true,
        enum: ['men', 'women', 'kid']
    },
    tag: {
        type: String,
        enum:['bestseller', 'featured', 'sale', 'new']
    }, 
    mainImage: {
        type: String,
        required: true
    },
    image1: {
        type: String,
        required: true
    },
    image2: {
        type: String,
        required: true
    },
    image3: {
        type: String,
        required: true
    },
    image4	: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default productSchema;
