import Order from "../../models/Order.js";

export const getAllOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.query;
        const orders = await Order
            .find({ status })
            .populate("client", "name email")
            .populate("products.id", "name price");

        if (!orders) {
            return res.status(404).json({ error: "Orders not found" });
        }

        res.status(200).json({ data: orders });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllOrdersByStatusClient = async (req, res) => {
    try {
        const { status } = req.query;
        const { client } = req.user;
        const orders = await Order
            .find({ status, client })
            .populate("client", "name email")
            .populate("products.id", "name price");

        if (!orders) {
            return res.status(404).json({ error: "Orders not found" });
        }

        res.status(200).json({ data: orders });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

