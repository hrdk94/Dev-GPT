import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "DevGPT API is running"
    });
});

// Connect MongoDB and start server
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

startServer();