import Product from "../../models/Product.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false });
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllProductsClient = async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false, isActive: true });
        res.status(200).json({ data: products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.query;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ data: product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getProductsByQuery = async (req, res) => {
    try {
        let query = { isDeleted: false, isActive: true };

        if (req.query.type) {
            query.type = req.query.type;
        }

        if (req.query.sex) {
            query.sex = req.query.sex;
        }

        if (req.query.tag) {
            query.tag = req.query.tag;
        }

        if (req.query.min && req.query.max) {
            query.price = { $gte: req.query.min, $lte: req.query.max };
        }

        const products = await Product.find(query);

        const productsWithImages = products.map(product => ({
            ...product._doc,
            mainImage: process.env.SERVER_URL + '/' + product.mainImage.replace(/ /g, '%20'),
            image1: process.env.SERVER_URL + '/' + product.image1.replace(/ /g, '%20'),
            image2: process.env.SERVER_URL + '/' + product.image2.replace(/ /g, '%20'),
            image3: process.env.SERVER_URL + '/' + product.image3.replace(/ /g, '%20'),
            image4: process.env.SERVER_URL + '/' + product.image4.replace(/ /g, '%20'),
        }));
        console.log(productsWithImages);
        res.status(200).json({ data: productsWithImages });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}