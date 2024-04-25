import Product from "../../models/Product.js";
import { io } from "../../index.js";
import Cart from "../../models/Cart.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock, type, sex, tag } = req.body;

        const newProduct = await Product.create({
            name,
            price,
            description,
            category,
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
        const { id, name, price, description, category, stock, type, sex, tag } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate
        (id, {
            name,
            price,
            description,
            category,
            stock,
            type,
            sex,
            tag
        })

        if(!updatedProduct) {
            return res.status(400).json({ error: "Product not updated" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct
        });

    }
    catch (error) {
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
        })
        
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