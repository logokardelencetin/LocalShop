import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import sellerOrderRoutes from "./routes/sellerOrder.routes.js";

const app = express();

const CLIENT_URL =
    process.env.CLIENT_URL ||
    "http://localhost:5173";

app.use(helmet());

app.use(
    cors({
        origin: CLIENT_URL,
        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(
    express.json({
        limit: "10kb",
    })
);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
});

app.use("/api", limiter);

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
app.use(
    "/api/seller/orders",
    sellerOrderRoutes
);
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

export default app;