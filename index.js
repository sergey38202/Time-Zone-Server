import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRouter from "./routes/user.js";
import productRouter from "./routes/product.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/product', productRouter);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URI);

app.listen(PORT, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    } else {
        console.log(`Server has been started on port: ${PORT}`);
    }
});