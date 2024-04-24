import * as dotenv from "dotenv";
import express from "express";
import connectToMongoDB from "./config/database.js";
import adminRouter from "./routes/adminRouter.js";
import cors from "cors";
import createSocketServer from "./config/socket.js";
import clientRouter from "./routes/clientRouter.js";


dotenv.config();

// connect to database first
connectToMongoDB();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

export const io = createSocketServer(app, port);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello World!");
})
