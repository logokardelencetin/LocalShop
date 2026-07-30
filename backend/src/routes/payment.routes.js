import express from "express";

import {
    payOrder,
} from "../controllers/payment.controller.js";

import {
    authorizeRoles,
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/pay",
    protect,
    authorizeRoles("customer"),
    payOrder
);

export default router;