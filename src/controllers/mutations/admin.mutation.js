import Admin from "../../models/Admins.js";
import hashData from "../../helpers/hashData.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { io } from "../../index.js";
import Client from "../../models/Client.js";

export const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        let role = 'admin'
        let admin = null;
        admin = await Admin.findOne({ email });
        console.log("account: " + admin);
        if (!admin) {
            admin = await Client.findOne({ email });
            role = 'client'
            if (!admin) {
                return res.status(401).json({ error: "Invalid credentials" });
            }
        }

        console.log(admin);

        bcrypt.compare(password, admin.password, (err, result) => {
            console.log(result);
            if (err || !result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }


            // Create a JWT token
            const token = jwt.sign(
                { id: admin.id, username: admin.username, name: admin.name, role: admin.role.role },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: "100000h",
                }
            );

            res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
            res.status(200).json({ message: "Login successful", token, userData: admin, role });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "loginAdmin",
            success: false,
        });
    }
};

export const getAdmin = async (req, res) => {
    try {
        //decode the token in Authorization header
        const token = req.header("Authorization");
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
        const admin = await Admin.findById(decoded.id).populate("role");
        if (!admin) {
            return res.status(401).json({ error: "Admin not found" });
        }

        const { username, name, email, role } = admin;

        res.status(200).json({ message: "Admin found", data: { username, name, email, role } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "getAdmin",
            success: false,
        });
    }
};

export const addAdmin = async (req, res) => {
    try {
        const { name, username, password, phone, email, role } = req.body;
        const hashedPassword = await hashData(password);

        // check if email already exists in Client collection
        const client = await Client.findOne({ email });

        if (client) {
            return res.status(400).json({
                message: "Email already exists in Client collection",
                success: false,
            });
        }

        const addedAdmin = await Admin.create({
            name,
            username,
            password: hashedPassword,
            phone,
            email,
            role,
        });

        const data = {
            data: addedAdmin,
            message: "Admin created",
            success: true,
        };
        return res.status(201).json(data);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            message: err.message,
            details: err,
            function: "addAdmin",
            success: false,
        });
    }
};

export const changeAdminRole = async (req, res) => {
    try {
        const { adminId, roleId } = req.body;
        const options = { new: true };
        const admin = await Admin.findByIdAndUpdate(adminId, { role: roleId }, options);

        if (!admin)
            return res.status(400).json({
                success: false,
                message: "Changing role failed",
            });

        io.emit("updated user role", admin);

        return res.status(200).json({
            data: admin,
            message: "Admin's role changed",
            success: true,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
            details: err,
            function: "updateAdminRole",
            success: false,
        });
    }
};

export const changeAdminPassword = async (req, res) => {
    try{
        const { userId, password } = req.body;
        const hashedPassword = await hashData(password);
        const options = { new: true };
        const admin = await Admin.findByIdAndUpdate(userId, { password: hashedPassword }, options);

        if (!admin)
            return res.status(400).json({
                success: false,
                message: "Changing password failed",
            });

        return res.status(200).json({
            data: admin,
            message: "User's password changed",
            success: true,
        });
    } catch(error) {
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "changeAdminPassword",
            success: false,
        });
    }
}

export const changeAdminDetails = async (req, res) => {
    try{
        const { id, name, username, phone, email } = req.body;
        const options = { new: true };

        const admin = await Admin.findByIdAndUpdate(id, { name, username, phone, email }, options);

        if(!admin)
            return res.status(400).json({
                success: false,
                message: "Changing details failed",
            });
        
        return res.status(200).json({
            data: admin,
            message: "User's details changed",
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "changeAdminDetails",
            success: false,
        });
    }
}