import mongoose from "mongoose";

import Order from "../models/Order.js";

export const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user._id;

        const orders = await Order.find({
            "items.sellerId": sellerId,
        })
            .populate("userId", "name email")
            .sort({
                createdAt: -1,
            });

        const sellerOrders = orders.map((order) => {
            const sellerItems = order.items.filter(
                (item) =>
                    item.sellerId.toString() ===
                    sellerId.toString()
            );

            const sellerTotal = sellerItems.reduce(
                (total, item) => total + item.subtotal,
                0
            );

            return {
                id: order._id,
                customer: order.userId,
                items: sellerItems,
                sellerTotal,
                orderTotal: order.totalPrice,
                status: order.status,
                createdAt: order.createdAt,
            };
        });

        return res.status(200).json({
            success: true,
            count: sellerOrders.length,
            data: {
                orders: sellerOrders,
            },
        });
    } catch (error) {
        console.error(
            "Get seller orders error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getSellerOrderById = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const order = await Order.findById(id)
            .populate("userId", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const sellerItems = order.items.filter(
            (item) =>
                item.sellerId.toString() ===
                sellerId.toString()
        );

        if (sellerItems.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to view this order",
            });
        }

        const sellerTotal = sellerItems.reduce(
            (total, item) => total + item.subtotal,
            0
        );

        return res.status(200).json({
            success: true,
            data: {
                order: {
                    id: order._id,
                    customer: order.userId,
                    items: sellerItems,
                    sellerTotal,
                    orderTotal: order.totalPrice,
                    status: order.status,
                    createdAt: order.createdAt,
                },
            },
        });
    } catch (error) {
        console.error(
            "Get seller order detail error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const updateSellerOrderStatus = async (
    req,
    res
) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const sellerId = req.user._id;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const allowedStatuses = [
            "SHIPPED",
            "DELIVERED",
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message:
                    "Status must be SHIPPED or DELIVERED",
            });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        if (
            !["PAID", "SHIPPED"].includes(order.status)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Only paid orders can be managed by seller",
            });
        }

        const sellerItems = order.items.filter(
            (item) =>
                item.sellerId.toString() ===
                sellerId.toString()
        );

        if (sellerItems.length === 0) {
            return res.status(403).json({
                success: false,
                message:
                    "You do not have permission to manage this order",
            });
        }

        for (const item of sellerItems) {
            if (
                status === "DELIVERED" &&
                item.fulfillmentStatus !== "SHIPPED"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Products must be shipped before they can be delivered",
                });
            }
        }

        sellerItems.forEach((item) => {
            item.fulfillmentStatus = status;
        });

        const allShippedOrDelivered =
            order.items.every((item) =>
                ["SHIPPED", "DELIVERED"].includes(
                    item.fulfillmentStatus
                )
            );

        const allDelivered =
            order.items.every(
                (item) =>
                    item.fulfillmentStatus === "DELIVERED"
            );

        if (allDelivered) {
            order.status = "DELIVERED";
        } else if (allShippedOrDelivered) {
            order.status = "SHIPPED";
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            data: {
                order: {
                    id: order._id,
                    status: order.status,
                    items: sellerItems,
                },
            },
        });
    } catch (error) {
        console.error(
            "Update seller order status error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};