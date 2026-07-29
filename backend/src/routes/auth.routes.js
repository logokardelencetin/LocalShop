import express from "express";

import {
    register,
    login,
    getMe,
    sellerTest,
} from "../controllers/auth.controller.js";

import {
    protect,
    authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
    "/me",
    protect,
    getMe
);

router.get(
    "/seller-test",
    protect,
    authorizeRoles("seller"),
    sellerTest
);

export default router;