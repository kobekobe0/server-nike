import Cart from "../../models/Cart.js";

export const addCartItem = async (req, res) => {
    const {client } = req.body;
    const { product, quantity } = req.body;
    try {
        const existingCartItem = await Cart.findOne({
            client: client.id,
            product,
        });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            await existingCartItem.save();
            return res.status(200).json({
                message: "Cart item updated successfully",
                data: existingCartItem,
                success: true,
            });
        }

        const newCartItem = await Cart.create({
            client: client.id  ,
            product,
            quantity,
        });

        res.status(201).json({
            message: "Cart item added successfully",
            data: newCartItem,
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "addCartItem",
            success: false,
        });
    }
}

export const removeCartItem = async (req, res) => {
    const { id } = req.query;
    try {
        const cartItem = await Cart.findByIdAndDelete(id);
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Cart item removed successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "removeCartItem",
            success: false,
        });
    }
}

export const updateCartItem = async (req, res) => {
    const { id } = req.query;
    const { quantity } = req.body;
    try {
        const cartItem = await Cart.findByIdAndUpdate
            (id, { quantity }, { new: true });
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found",
                success: false,
            });
        }

        res.status(200).json({
            message: "Cart item updated successfully",
            data: cartItem,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "updateCartItem",
            success: false,
        });
    }
}