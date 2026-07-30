import mongoose from "mongoose";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const SUCCESS_CARD = "4242424242424242";
const FAILED_CARD = "4000000000000000";

export const payOrder = async (req, res) => {
    try {
        const {
            orderId,
            cardNumber,
            cardHolder,
            expiry,
            cvv,
        } = req.body;

        if (
            !orderId ||
            !cardNumber ||
            !cardHolder ||
            !expiry ||
            !cvv
        ) {
            return res.status(400).json({
                success: false,
                message: "All payment fields are required",
            });
        }

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order id",
            });
        }

        const normalizedCardNumber = String(
            cardNumber
        ).replace(/\s/g, "");

        const order = await Order.findById(orderId);

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
                    "You do not have permission to pay this order",
            });
        }

        if (
            ["PAID", "SHIPPED", "DELIVERED"].includes(
                order.status
            )
        ) {
            return res.status(409).json({
                success: false,
                message: "Order has already been paid",
            });
        }

        if (normalizedCardNumber === FAILED_CARD) {
            order.status = "PAYMENT_FAILED";

            await order.save();

            return res.status(402).json({
                success: false,
                message: "Payment failed",
                data: {
                    order: {
                        id: order._id,
                        status: order.status,
                    },
                },
            });
        }

        if (normalizedCardNumber !== SUCCESS_CARD) {
            return res.status(400).json({
                success: false,
                message: "Invalid test card number",
            });
        }

        const decreasedProducts = [];

        for (const item of order.items) {
            const result = await Product.updateOne(
                {
                    _id: item.productId,
                    stock: {
                        $gte: item.quantity,
                    },
                },
                {
                    $inc: {
                        stock: -item.quantity,
                    },
                }
            );

            if (result.modifiedCount !== 1) {
                for (const decreasedItem of decreasedProducts) {
                    await Product.updateOne(
                        {
                            _id: decreasedItem.productId,
                        },
                        {
                            $inc: {
                                stock: decreasedItem.quantity,
                            },
                        }
                    );
                }

                order.status = "PAYMENT_FAILED";

                await order.save();

                return res.status(409).json({
                    success: false,
                    message:
                        "Payment could not be completed because one or more products are out of stock",
                    data: {
                        order: {
                            id: order._id,
                            status: order.status,
                        },
                    },
                });
            }

            decreasedProducts.push({
                productId: item.productId,
                quantity: item.quantity,
            });
        }

        order.status = "PAID";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment successful",
            data: {
                order: {
                    id: order._id,
                    totalPrice: order.totalPrice,
                    status: order.status,
                },
            },
        });
    } catch (error) {
        console.error("Payment error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};