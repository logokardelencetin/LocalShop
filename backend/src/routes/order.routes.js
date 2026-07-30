import express from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
} from "../controllers/order.controller.js";

import {
    authorizeRoles,
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(
    protect,
    authorizeRoles("customer")
);

router.post("/", createOrder);

router.get("/", getMyOrders);

router.get("/:id", getOrderById);

export default router;