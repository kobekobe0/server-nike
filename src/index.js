import * as dotenv from "dotenv";
import express from "express";
import connectToMongoDB from "./config/database.js";
import adminRouter from "./routes/adminRouter.js";
import cors from "cors";
import createSocketServer from "./config/socket.js";
import clientRouter from "./routes/clientRouter.js";
import productRouter from "./routes/productRouter.js";
import bodyParser from 'body-parser';
import multer from "multer";
import orderRouter from "./routes/orderRouter.js";
import cartRouter from "./routes/cartRouter.js";

import path,  { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// connect to database first
connectToMongoDB();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://localhost:3000/",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // required to pass
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter)
app.use("/api/v1/cart", cartRouter)

app.use('/images', express.static(path.join(__dirname, 'images')));

export const io = createSocketServer(app, port);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
})
