import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import { api } from "../../api/client";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const formatDate = (date) => {
    return new Intl.DateTimeFormat(
        "tr-TR",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(new Date(date));
};

const OrdersPage = () => {
    const location =
        useLocation();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadOrders =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/orders"
                    );

                setOrders(
                    response.data.orders
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Siparişler yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    if (loading) {
        return (
            <div className="page-message">
                Siparişler yükleniyor...
            </div>
        );
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <h1>Siparişlerim</h1>

                    <p className="muted">
                        Geçmiş siparişlerinizi ve
                        ödeme durumlarını
                        görüntüleyin.
                    </p>
                </div>
            </div>

            {location.state?.message && (
                <div className="alert success-alert">
                    {location.state.message}
                </div>
            )}

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="empty-state">
                    <h2>
                        Henüz siparişiniz yok
                    </h2>

                    <p>
                        Ürünleri inceleyerek ilk
                        siparişinizi
                        oluşturabilirsiniz.
                    </p>

                    <Link
                        to="/products"
                        className="button"
                    >
                        Ürünleri Gör
                    </Link>
                </div>
            ) : (
                <div className="customer-orders">
                    {orders.map((order) => (
                        <article
                            className="card customer-order-card"
                            key={order._id}
                        >
                            <div className="customer-order-header">
                                <div>
                                    <strong>
                                        Sipariş #
                                        {order._id.slice(-8)}
                                    </strong>

                                    <div className="muted">
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </div>
                                </div>

                                <span
                                    className={`status-badge status-${order.status.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            className="customer-order-item"
                                            key={`${item.productId}-${index}`}
                                        >
                                            <div>
                                                <strong>
                                                    {item.name}
                                                </strong>

                                                <div className="muted">
                                                    {
                                                        item.quantity
                                                    }{" "}
                                                    adet ×{" "}
                                                    {formatPrice(
                                                        item.price
                                                    )}
                                                </div>
                                            </div>

                                            <strong>
                                                {formatPrice(
                                                    item.subtotal
                                                )}
                                            </strong>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="customer-order-footer">
                                <div>
                                    <span className="muted">
                                        Toplam
                                    </span>

                                    <strong>
                                        {formatPrice(
                                            order.totalPrice
                                        )}
                                    </strong>
                                </div>

                                {[
                                    "PENDING_PAYMENT",
                                    "PAYMENT_FAILED",
                                ].includes(
                                    order.status
                                ) && (
                                        <Link
                                            to={`/payment/${order._id}`}
                                            className="button"
                                        >
                                            {order.status ===
                                                "PAYMENT_FAILED"
                                                ? "Tekrar Öde"
                                                : "Ödemeye Git"}
                                        </Link>
                                    )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default OrdersPage;