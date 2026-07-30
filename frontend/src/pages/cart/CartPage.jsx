import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { api } from "../../api/client";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const CartPage = () => {
    const navigate = useNavigate();

    const [cart, setCart] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadCart = useCallback(
        async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get("/cart");

                setCart(response.data.cart);
            } catch (error) {
                setError(
                    error.message ||
                    "Sepet yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        loadCart();
    }, [loadCart]);

    const items =
        cart?.items || [];

    const total = useMemo(() => {
        return items.reduce(
            (sum, item) => {
                if (!item.productId) {
                    return sum;
                }

                return (
                    sum +
                    item.productId.price *
                    item.quantity
                );
            },
            0
        );
    }, [items]);

    const handleQuantity = async (
        productId,
        quantity
    ) => {
        if (quantity < 1) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            const response =
                await api.put(
                    `/cart/items/${productId}`,
                    {
                        quantity,
                    }
                );

            setCart(response.data.cart);
        } catch (error) {
            setError(
                error.message ||
                "Sepet güncellenemedi."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemove = async (
        productId
    ) => {
        try {
            setActionLoading(true);
            setError("");

            const response =
                await api.delete(
                    `/cart/items/${productId}`
                );

            setCart(response.data.cart);
        } catch (error) {
            setError(
                error.message ||
                "Ürün sepetten silinemedi."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleClear = async () => {
        const confirmed =
            window.confirm(
                "Sepeti tamamen temizlemek istediğinize emin misiniz?"
            );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(true);
            setError("");

            const response =
                await api.delete("/cart");

            setCart(response.data.cart);
        } catch (error) {
            setError(
                error.message ||
                "Sepet temizlenemedi."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateOrder =
        async () => {
            try {
                setActionLoading(true);
                setError("");

                const response =
                    await api.post("/orders");

                const order =
                    response.data.order;

                navigate(
                    `/payment/${order._id}`
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Sipariş oluşturulamadı."
                );
            } finally {
                setActionLoading(false);
            }
        };

    if (loading) {
        return (
            <div className="page-message">
                Sepet yükleniyor...
            </div>
        );
    }

    return (
        <section>
            <div className="page-heading">
                <div>
                    <h1>Sepetim</h1>

                    <p className="muted">
                        Siparişinizi oluşturmadan
                        önce ürünlerinizi kontrol
                        edin.
                    </p>
                </div>

                {items.length > 0 && (
                    <button
                        type="button"
                        className="button secondary"
                        onClick={handleClear}
                        disabled={actionLoading}
                    >
                        Sepeti Temizle
                    </button>
                )}
            </div>

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            {items.length === 0 ? (
                <div className="empty-state">
                    <h2>Sepetiniz boş</h2>

                    <p>
                        Ürünleri keşfedip sepetinize
                        ekleyebilirsiniz.
                    </p>

                    <Link
                        to="/products"
                        className="button"
                    >
                        Ürünlere Git
                    </Link>
                </div>
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {items.map((item) => {
                            const product =
                                item.productId;

                            if (!product) {
                                return null;
                            }

                            const subtotal =
                                product.price *
                                item.quantity;

                            return (
                                <article
                                    className="card cart-item"
                                    key={product._id}
                                >
                                    <div className="cart-item-info">
                                        <Link
                                            to={`/products/${product._id}`}
                                            className="cart-item-name"
                                        >
                                            {product.name}
                                        </Link>

                                        <span className="category-badge">
                                            {product.category}
                                        </span>

                                        <span className="muted">
                                            Birim fiyat:{" "}
                                            {formatPrice(
                                                product.price
                                            )}
                                        </span>

                                        <span className="muted">
                                            Stok:{" "}
                                            {product.stock}
                                        </span>
                                    </div>

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantity(
                                                    product._id,
                                                    item.quantity - 1
                                                )
                                            }
                                            disabled={
                                                actionLoading ||
                                                item.quantity <= 1
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleQuantity(
                                                    product._id,
                                                    item.quantity + 1
                                                )
                                            }
                                            disabled={
                                                actionLoading ||
                                                item.quantity >=
                                                product.stock
                                            }
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-price">
                                        <strong>
                                            {formatPrice(
                                                subtotal
                                            )}
                                        </strong>

                                        <button
                                            type="button"
                                            className="text-button danger-text"
                                            onClick={() =>
                                                handleRemove(
                                                    product._id
                                                )
                                            }
                                            disabled={
                                                actionLoading
                                            }
                                        >
                                            Sil
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    <aside className="card cart-summary">
                        <h2>Sipariş Özeti</h2>

                        <div className="summary-row">
                            <span>
                                Ürün çeşidi
                            </span>

                            <strong>
                                {items.length}
                            </strong>
                        </div>

                        <div className="summary-row total">
                            <span>Toplam</span>

                            <strong>
                                {formatPrice(total)}
                            </strong>
                        </div>

                        <button
                            type="button"
                            className="button full"
                            onClick={
                                handleCreateOrder
                            }
                            disabled={
                                actionLoading ||
                                items.length === 0
                            }
                        >
                            {actionLoading
                                ? "İşleniyor..."
                                : "Sipariş Oluştur"}
                        </button>

                        <p className="summary-note">
                            Nihai toplam backend
                            tarafından tekrar
                            hesaplanacaktır.
                        </p>
                    </aside>
                </div>
            )}
        </section>
    );
};

export default CartPage;