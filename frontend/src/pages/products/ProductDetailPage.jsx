import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { api } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const ProductDetailPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const [product, setProduct] =
        useState(null);

    const [quantity, setQuantity] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [adding, setAdding] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(`/products/${id}`);

                setProduct(
                    response.data.product
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Ürün yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (user.role !== "customer") {
            return;
        }

        try {
            setAdding(true);
            setError("");
            setSuccess("");

            await api.post(
                "/cart/items",
                {
                    productId: product._id,
                    quantity,
                }
            );

            setSuccess(
                "Ürün sepete eklendi."
            );
        } catch (error) {
            setError(
                error.message ||
                "Ürün sepete eklenemedi."
            );
        } finally {
            setAdding(false);
        }
    };

    if (loading) {
        return (
            <div className="page-message">
                Ürün yükleniyor...
            </div>
        );
    }

    if (error && !product) {
        return (
            <section>
                <div className="alert error-alert">
                    {error}
                </div>

                <Link
                    to="/products"
                    className="back-link"
                >
                    ← Ürünlere dön
                </Link>
            </section>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <section>
            <Link
                to="/products"
                className="back-link"
            >
                ← Ürünlere dön
            </Link>

            <div className="product-detail card">
                <div>
                    <span className="category-badge">
                        {product.category}
                    </span>

                    <h1>{product.name}</h1>

                    <p className="product-detail-description">
                        {product.description}
                    </p>

                    {product.sellerId && (
                        <div className="seller-box">
                            <span className="muted">
                                Satıcı
                            </span>

                            <strong>
                                {product.sellerId.name}
                            </strong>

                            {product.sellerId.email && (
                                <span className="muted">
                                    {product.sellerId.email}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <aside className="product-detail-summary">
                    <span className="muted">
                        Fiyat
                    </span>

                    <strong className="detail-price">
                        {formatPrice(
                            product.price
                        )}
                    </strong>

                    <div className="detail-stock">
                        {product.stock > 0 ? (
                            <>
                                <span className="stock available">
                                    Stokta
                                </span>

                                <span>
                                    {product.stock} adet
                                </span>
                            </>
                        ) : (
                            <span className="stock unavailable">
                                Tükendi
                            </span>
                        )}
                    </div>

                    {error && (
                        <div className="alert error-alert">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert success-alert">
                            {success}
                        </div>
                    )}

                    {!user && (
                        <div className="product-login-box">
                            <p>
                                Sepete eklemek için giriş
                                yapmanız gerekiyor.
                            </p>

                            <Link
                                to="/login"
                                className="button full"
                            >
                                Giriş Yap
                            </Link>
                        </div>
                    )}

                    {user?.role === "customer" &&
                        product.stock > 0 && (
                            <div className="add-cart-box">
                                <label htmlFor="quantity">
                                    Adet
                                </label>

                                <input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(event) => {
                                        const value =
                                            Number(
                                                event.target.value
                                            );

                                        setQuantity(value);
                                    }}
                                />

                                <button
                                    type="button"
                                    className="button full"
                                    onClick={
                                        handleAddToCart
                                    }
                                    disabled={
                                        adding ||
                                        quantity < 1 ||
                                        quantity >
                                        product.stock
                                    }
                                >
                                    {adding
                                        ? "Ekleniyor..."
                                        : "Sepete Ekle"}
                                </button>

                                <Link
                                    to="/cart"
                                    className="button secondary full"
                                >
                                    Sepete Git
                                </Link>
                            </div>
                        )}

                    {user?.role === "seller" && (
                        <p className="muted">
                            Satıcı hesapları alışveriş
                            sepetini kullanamaz.
                        </p>
                    )}
                </aside>
            </div>
        </section>
    );
};

export default ProductDetailPage;