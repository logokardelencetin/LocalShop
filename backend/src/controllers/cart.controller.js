import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            userId: req.user._id,
        }).populate(
            "items.productId",
            "name description price stock category"
        );

        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: [],
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a positive integer",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock",
            });
        }

        let cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            cart = new Cart({
                userId: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.productId.toString() ===
                productId
        );

        if (existingItem) {
            const newQuantity =
                existingItem.quantity + quantity;

            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock",
                });
            }

            existingItem.quantity = newQuantity;
        } else {
            cart.items.push({
                productId,
                quantity,
            });
        }

        await cart.save();

        cart = await Cart.findById(cart._id).populate(
            "items.productId",
            "name description price stock category"
        );

        return res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error("Add to cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Quantity must be a positive integer",
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock",
            });
        }

        let cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(
            (item) =>
                item.productId.toString() ===
                productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product is not in cart",
            });
        }

        item.quantity = quantity;

        await cart.save();

        cart = await Cart.findById(cart._id).populate(
            "items.productId",
            "name description price stock category"
        );

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error("Update cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        let cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const initialLength = cart.items.length;

        cart.items = cart.items.filter(
            (item) =>
                item.productId.toString() !==
                productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product is not in cart",
            });
        }

        await cart.save();

        cart = await Cart.findById(cart._id).populate(
            "items.productId",
            "name description price stock category"
        );

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error(
            "Remove from cart error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            userId: req.user._id,
        });

        if (!cart) {
            cart = await Cart.create({
                userId: req.user._id,
                items: [],
            });
        } else {
            cart.items = [];

            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: {
                cart,
            },
        });
    } catch (error) {
        console.error("Clear cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};