import Product from "../../models/Product.js";
import { io } from "../../index.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, type, sex, tag } = req.body;

        const newProduct = await Product.create({
            name,
            price,
            description,
            stock,
            type,
            sex,
            tag,
            mainImage: `images/mainImages/${name}.webp`,
            image1: `images/${name}/${name}1.webp`,
            image2: `images/${name}/${name}2.webp`,
            image3: `images/${name}/${name}3.webp`,
            image4: `images/${name}/${name}4.webp`
        });

        if(!newProduct) {
            return res.status(400).json({ error: "Product not created" });
        }

        res.status(201).json({
            message: "Product created successfully",
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id, price, description, stock, type, sex, tag } = req.body;
        const objId = new mongoose.Types.ObjectId(id);

        console.log(id)

        let update = {};
        if (price) update.price = price;
        if (description) update.description = description;
        if (stock) update.stock = stock;
        if (type) update.type = type;
        if (sex) update.sex = sex;
        if (tag) update.tag = tag;

        const product = await Product.findOne({_id: objId});
        console.log(product);

        const updatedProduct = await Product.findByIdAndUpdate(objId, update, {new: true});

        if(!updatedProduct) {
            return res.status(400).json({ error: "Product not updated" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const deletedProduct = await Product.findByIdAndUpdate
        (id, {
            isDeleted: true
        })

        if(!deletedProduct) {
            return res.status(400).json({ error: "Product not deleted" });
        }

        //delete cart items with the product id

        const deletedCart = await Cart.deleteMany({
            product: id
        })

        res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateProductStatus = async (req, res) => {
    try {
        const { id, isActive } = req.body;

        const updatedProduct
        = await Product.findByIdAndUpdate
        (id, {
            isActive
        }, {new: true})
        
        if(!updatedProduct) {
            return res.status(400).json({ error: "Product status not updated" });
        }

        res.status(200).json({
            message: "Product status updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}