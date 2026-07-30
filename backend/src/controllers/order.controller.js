import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.user._id,
        }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        const orderItems = [];
        let totalPrice = 0;

        for (const cartItem of cart.items) {
            const product = cartItem.productId;

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message:
                        "One of the products in your cart no longer exists",
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}`,
                });
            }

            const subtotal =
                product.price * cartItem.quantity;

            orderItems.push({
                productId: product._id,
                sellerId: product.sellerId,
                name: product.name,
                price: product.price,
                quantity: cartItem.quantity,
                subtotal,
            });

            totalPrice += subtotal;
        }

        const order = await Order.create({
            userId: req.user._id,
            items: orderItems,
            totalPrice,
            status: "PENDING_PAYMENT",
        });

        cart.items = [];

        await cart.save();

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: {
                order,
            },
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.user._id,
        })
            .populate(
                "items.productId",
                "name description category"
            )
            .sort({
                createdAt: -1,
            });

        return res.status(200).json({
            success: true,
            count: orders.length,
            data: {
                orders,
            },
        });
    } catch (error) {
        console.error("Get orders error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const order = await Order.findById(id).populate(
            "items.productId",
            "name description category"
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (
            order.userId.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to view this order",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                order,
            },
        });
    } catch (error) {
        console.error("Get order detail error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};