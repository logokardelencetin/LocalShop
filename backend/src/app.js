import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
    })
);

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
});

app.use(limiter);

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LocalShop API is running",
    });
});

app.use("/api/auth", authRoutes);

export default app;