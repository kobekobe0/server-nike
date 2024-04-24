import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';

const clientAuth = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'No token provided', success: false, function: "clientAuthMiddleware" });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY);
        const client = await Client.findById(decoded.id);

        if (!client) {
            return res.status(401).json({ error: 'client not found', success: false, function: "clientAuthMiddleware" });
        }

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token', success: false, function: "clientAuthMiddleware", message: err.message });
    }
};

export default clientAuth;
