import express from "express";

import {
    createProduct,
    deleteProduct,
    getMyProducts,
    getProductById,
    getProducts,
    updateProduct,
} from "../controllers/product.controller.js";

import {
    authorizeRoles,
    protect,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get(
    "/mine",
    protect,
    authorizeRoles("seller"),
    getMyProducts
);

router.post(
    "/",
    protect,
    authorizeRoles("seller"),
    createProduct
);

router.get("/:id", getProductById);

router.put(
    "/:id",
    protect,
    authorizeRoles("seller"),
    updateProduct
);

router.delete(
    "/:id",
    protect,
    authorizeRoles("seller"),
    deleteProduct
);

export default router;