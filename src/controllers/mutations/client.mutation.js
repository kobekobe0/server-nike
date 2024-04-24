import Client from "../../models/Client.js";
import hashData from "../../helpers/hashData.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { io } from "../../index.js";


export const loginClient = async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await
        Client.findOne({ email });
        console.log("account: " + client);
        if (!client) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log(client);

        bcrypt.compare(password, client.password, (err, result) => {
            console.log(result);
            if (err || !result) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

        }
        );
        // Create a JWT token
        const token = jwt.sign(
            { id: client.id, username: client.username, name: client.name },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "100000h",
            }
        );
 
        res.json({ message: "Login successful", token, userData: client });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "loginClient",
            success: false,
        });
    }
}

export const signUpClient = async (req, res) => {
    const { name, username, email, password } = req.body;
    try {
        const hashedPassword = await hashData(password);
        const newClient = new Client({
            name,
            username,
            email,
            password: hashedPassword,
        });

        const client = await newClient.save();
        res.status(201).json({ message: "Client created", data: client });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "signUpClient",
            success: false,
        });
    }
}

export const getClient = async (req, res) => {
    try {
        //decode the token in Authorization header
        const token = req.header("Authorization");
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET_KEY);
        const client = await Client.findById(decoded.id);
        if (!client) {
            return res.status(401).json({ error: "Client not found" });
        }

        const { username, name, email } = client;

        res.status(200).json({ message: "Client found", data: { username, name, email } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message,
            details: error,
            function: "getClient",
            success: false,
        });
    }
}

