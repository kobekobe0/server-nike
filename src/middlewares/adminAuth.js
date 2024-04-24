import jwt from 'jsonwebtoken';
import Admin from '../models/Admins.js';

//Authorization header should look like : Authorization = "Bearer <token>"
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'No token provided', success: false, function: "adminAuthMiddleware" });
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', success: false, function: "adminAuthMiddleware", message: err.message });
    }

    const admin = Admin.findById(decoded.id);

    if (!admin) {
        return res.status(401).json({ error: 'Admin not found', success: false, function: "adminAuthMiddleware" });
    }

    req.user = decoded;

    next();
  });
};

export default adminAuth;