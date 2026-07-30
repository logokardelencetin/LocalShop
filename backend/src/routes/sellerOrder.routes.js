import express from "express";

import {
    getSellerOrderById,
    getSellerOrders,
    updateSellerOrderStatus,
} from "../controllers/sellerOrder.controller.js";

import {
    authorizeRoles,
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(
    protect,
    authorizeRoles("seller")
);

router.get("/", getSellerOrders);

router.get("/:id", getSellerOrderById);

router.patch(
    "/:id/status",
    updateSellerOrderStatus
);

export default router;