import mongoose from "mongoose";

import Product from "../models/Product.js";

const escapeRegex = (value = "") => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            category,
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            stock === undefined ||
            !category
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, description, price, stock and category are required",
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price,
            stock,
            category: category.trim().toLowerCase(),
            sellerId: req.user._id,
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        console.error("Create product error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getProducts = async (req, res) => {
    try {
        const {
            category,
            search,
        } = req.query;

        const filter = {};

        if (category) {
            filter.category = category.trim().toLowerCase();
        }

        if (search) {
            const safeSearch = escapeRegex(search.trim());

            filter.$or = [
                {
                    name: {
                        $regex: safeSearch,
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: safeSearch,
                        $options: "i",
                    },
                },
            ];
        }

        const products = await Product.find(filter)
            .populate("sellerId", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: products.length,
            data: {
                products,
            },
        });
    } catch (error) {
        console.error("Get products error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        const product = await Product.findById(id)
            .populate("sellerId", "name email");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                product,
            },
        });
    } catch (error) {
        console.error("Get product detail error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({
            sellerId: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: products.length,
            data: {
                products,
            },
        });
    } catch (error) {
        console.error("Get my products error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (
            product.sellerId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only update your own products",
            });
        }

        const allowedFields = [
            "name",
            "description",
            "price",
            "stock",
            "category",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        if (typeof product.name === "string") {
            product.name = product.name.trim();
        }

        if (typeof product.description === "string") {
            product.description =
                product.description.trim();
        }

        if (typeof product.category === "string") {
            product.category =
                product.category.trim().toLowerCase();
        }

        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        console.error("Update product error:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id",
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (
            product.sellerId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only delete your own products",
            });
        }

        await product.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};