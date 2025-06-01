import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import morgan from "morgan";
import packageRoutes from "./routes/packageRoutes";

const app = express();
const MONGODB_URI = process.env.MONGODB_URI as string;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later",
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check of the endpoint
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/packages", packageRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.originalUrl,
    });
});

// Connect to mongodb to start the server
mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));

export default app;
