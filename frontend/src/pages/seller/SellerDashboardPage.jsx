import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import { api } from "../../api/client";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const SellerDashboardPage = () => {
    const [products, setProducts] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionError, setActionError] =
        useState("");

    const loadDashboard = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    productsResponse,
                    ordersResponse,
                ] = await Promise.all([
                    api.get("/products/mine"),
                    api.get("/seller/orders"),
                ]);

                setProducts(
                    productsResponse.data.products
                );

                setOrders(
                    ordersResponse.data.orders
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Satıcı paneli yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const handleDelete = async (
        productId
    ) => {
        const confirmed =
            window.confirm(
                "Bu ürünü silmek istediğinize emin misiniz?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionError("");

            await api.delete(
                `/products/${productId}`
            );

            setProducts((current) =>
                current.filter(
                    (product) =>
                        product._id !== productId
                )
            );
        } catch (error) {
            setActionError(
                error.message ||
                "Ürün silinemedi."
            );
        }
    };

    const handleOrderStatus = async (
        orderId,
        status
    ) => {
        try {
            setActionError("");

            await api.patch(
                `/seller/orders/${orderId}/status`,
                {
                    status,
                }
            );

            await loadDashboard();
        } catch (error) {
            setActionError(
                error.message ||
                "Sipariş durumu güncellenemedi."
            );
        }
    };

    if (loading) {
        return (
            <div className="page-message">
                Satıcı paneli yükleniyor...
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert error-alert">
                {error}
            </div>
        );
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <h1>Satıcı Paneli</h1>

                    <p className="muted">
                        Ürünlerinizi ve gelen
                        siparişlerinizi yönetin.
                    </p>
                </div>

                <Link
                    to="/seller/products/add"
                    className="button"
                >
                    + Ürün Ekle
                </Link>
            </div>

            {actionError && (
                <div className="alert error-alert">
                    {actionError}
                </div>
            )}

            <div className="dashboard-stats">
                <div className="card stat-card">
                    <span className="muted">
                        Ürün Sayısı
                    </span>

                    <strong>
                        {products.length}
                    </strong>
                </div>

                <div className="card stat-card">
                    <span className="muted">
                        Gelen Sipariş
                    </span>

                    <strong>
                        {orders.length}
                    </strong>
                </div>

                <div className="card stat-card">
                    <span className="muted">
                        Ödenmiş Sipariş
                    </span>

                    <strong>
                        {
                            orders.filter(
                                (order) =>
                                    order.status ===
                                    "PAID" ||
                                    order.status ===
                                    "SHIPPED" ||
                                    order.status ===
                                    "DELIVERED"
                            ).length
                        }
                    </strong>
                </div>
            </div>

            <section className="dashboard-section">
                <div className="section-heading">
                    <h2>Ürünlerim</h2>
                </div>

                {products.length === 0 ? (
                    <div className="empty-state">
                        <h3>
                            Henüz ürününüz yok
                        </h3>

                        <Link
                            to="/seller/products/add"
                            className="button"
                        >
                            İlk Ürünü Ekle
                        </Link>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Ürün</th>
                                    <th>Kategori</th>
                                    <th>Fiyat</th>
                                    <th>Stok</th>
                                    <th />
                                </tr>
                            </thead>

                            <tbody>
                                {products.map(
                                    (product) => (
                                        <tr
                                            key={product._id}
                                        >
                                            <td>
                                                <strong>
                                                    {product.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    product.category
                                                }
                                            </td>

                                            <td>
                                                {formatPrice(
                                                    product.price
                                                )}
                                            </td>

                                            <td>
                                                {product.stock}
                                            </td>

                                            <td>
                                                <div className="table-actions">
                                                    <Link
                                                        to={`/seller/products/${product._id}/edit`}
                                                        className="button secondary small"
                                                    >
                                                        Düzenle
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="button danger small"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="dashboard-section">
                <div className="section-heading">
                    <h2>
                        Gelen Siparişler
                    </h2>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        Henüz sipariş yok.
                    </div>
                ) : (
                    <div className="seller-orders">
                        {orders.map((order) => {
                            const allShipped =
                                order.items.every(
                                    (item) =>
                                        [
                                            "SHIPPED",
                                            "DELIVERED",
                                        ].includes(
                                            item.fulfillmentStatus
                                        )
                                );

                            const allDelivered =
                                order.items.every(
                                    (item) =>
                                        item.fulfillmentStatus ===
                                        "DELIVERED"
                                );

                            return (
                                <article
                                    className="card seller-order-card"
                                    key={order.id}
                                >
                                    <div className="seller-order-header">
                                        <div>
                                            <strong>
                                                Sipariş #
                                                {order.id.slice(-8)}
                                            </strong>

                                            <p className="muted">
                                                {
                                                    order.customer
                                                        ?.name
                                                }
                                                {" · "}
                                                {
                                                    order.customer
                                                        ?.email
                                                }
                                            </p>
                                        </div>

                                        <span className="order-status">
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
                                                    className="seller-order-item"
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

                                                    <div>
                                                        <strong>
                                                            {formatPrice(
                                                                item.subtotal
                                                            )}
                                                        </strong>

                                                        <div className="muted">
                                                            {
                                                                item.fulfillmentStatus
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    <div className="seller-order-footer">
                                        <div>
                                            <span className="muted">
                                                Size ait toplam
                                            </span>

                                            <strong className="seller-total">
                                                {formatPrice(
                                                    order.sellerTotal
                                                )}
                                            </strong>
                                        </div>

                                        <div className="table-actions">
                                            {order.status ===
                                                "PAID" &&
                                                !allShipped && (
                                                    <button
                                                        type="button"
                                                        className="button"
                                                        onClick={() =>
                                                            handleOrderStatus(
                                                                order.id,
                                                                "SHIPPED"
                                                            )
                                                        }
                                                    >
                                                        Kargoya Ver
                                                    </button>
                                                )}

                                            {[
                                                "PAID",
                                                "SHIPPED",
                                            ].includes(
                                                order.status
                                            ) &&
                                                allShipped &&
                                                !allDelivered && (
                                                    <button
                                                        type="button"
                                                        className="button"
                                                        onClick={() =>
                                                            handleOrderStatus(
                                                                order.id,
                                                                "DELIVERED"
                                                            )
                                                        }
                                                    >
                                                        Teslim Edildi
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </section>
    );
};

export default SellerDashboardPage;