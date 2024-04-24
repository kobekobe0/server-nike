import jwt from 'jsonwebtoken';
import Photographer from '../models/Photographers.js';
import Admin from '../models/Admins.js';

const photographerAuth = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'No token provided', success: false, function: "photographerAuthMiddleware" });
    }

    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token', success: false, function: "photographerAuthMiddleware" });
        }

        const photographer = Photographer.findById(decoded.id);
        const admin = Admin.findById(decoded.id);
        
        if (!photographer || !admin) {
            return res.status(401).json({ error: 'Photographer not found', success: false, function: "photographerAuthMiddleware" });
        }

        req.user = decoded;

        next();
    });
}

export default photographerAuth;