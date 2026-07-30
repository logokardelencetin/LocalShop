import {
    Navigate,
    createBrowserRouter,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import AppLayout from "../layouts/AppLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import ProductListPage from "../pages/products/ProductListPage";
import ProductDetailPage from "../pages/products/ProductDetailPage";

import CartPage from "../pages/cart/CartPage";

import OrdersPage from "../pages/orders/OrdersPage";

import PaymentPage from "../pages/payment/PaymentPage";

import SellerDashboardPage from "../pages/seller/SellerDashboardPage";
import AddProductPage from "../pages/seller/AddProductPage";

import NotFoundPage from "../pages/NotFoundPage";
import EditProductPage from "../pages/seller/EditProductPage";

export const router =
    createBrowserRouter([
        {
            path: "/",
            element: <AppLayout />,

            children: [
                {
                    index: true,
                    element: (
                        <Navigate
                            to="/products"
                            replace
                        />
                    ),
                },

                {
                    path: "login",
                    element: <LoginPage />,
                },

                {
                    path: "register",
                    element: <RegisterPage />,
                },

                {
                    path: "products",
                    element: (
                        <ProductListPage />
                    ),
                },

                {
                    path: "products/:id",
                    element: (
                        <ProductDetailPage />
                    ),
                },

                {
                    element: (
                        <ProtectedRoute />
                    ),

                    children: [
                        {
                            element: (
                                <RoleRoute
                                    allowedRoles={[
                                        "customer",
                                    ]}
                                />
                            ),

                            children: [
                                {
                                    path: "cart",
                                    element: (
                                        <CartPage />
                                    ),
                                },

                                {
                                    path: "orders",
                                    element: (
                                        <OrdersPage />
                                    ),
                                },

                                {
                                    path:
                                        "payment/:orderId",
                                    element: (
                                        <PaymentPage />
                                    ),
                                },
                            ],
                        },

                        {
                            element: (
                                <RoleRoute
                                    allowedRoles={[
                                        "seller",
                                    ]}
                                />
                            ),

                            children: [
                                {
                                    path: "seller",
                                    element: (
                                        <SellerDashboardPage />
                                    ),
                                },

                                {
                                    path:
                                        "seller/products/add",
                                    element: (
                                        <AddProductPage />
                                    ),
                                },
                                {
                                    path: "seller/products/:id/edit",
                                    element: (
                                        <EditProductPage />
                                    ),
                                },
                            ],
                        },
                    ],
                },

                {
                    path: "*",
                    element: <NotFoundPage />,
                },
            ],
        },
    ]);