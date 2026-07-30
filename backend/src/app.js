import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

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
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

export default app;