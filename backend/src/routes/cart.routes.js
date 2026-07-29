import express from "express";

import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
    updateCartItem,
} from "../controllers/cart.controller.js";

import {
    authorizeRoles,
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(
    protect,
    authorizeRoles("customer")
);

router.get("/", getCart);

router.post("/items", addToCart);

router.put(
    "/items/:productId",
    updateCartItem
);

router.delete(
    "/items/:productId",
    removeFromCart
);

router.delete("/", clearCart);

export default router;