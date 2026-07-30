import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import { api } from "../../api/client";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const ProductDetailPage = () => {
    const { id } = useParams();

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/products/${id}`
                    );

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

    if (loading) {
        return (
            <div className="page-message">
                Ürün yükleniyor...
            </div>
        );
    }

    if (error) {
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
                                    {
                                        product.sellerId
                                            .email
                                    }
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
                </aside>
            </div>
        </section>
    );
};

export default ProductDetailPage;