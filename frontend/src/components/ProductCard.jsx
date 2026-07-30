import { Link } from "react-router-dom";

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const ProductCard = ({ product }) => {
    return (
        <article className="product-card">
            <div className="product-card-content">
                <div className="product-card-header">
                    <span className="category-badge">
                        {product.category}
                    </span>

                    <span
                        className={
                            product.stock > 0
                                ? "stock available"
                                : "stock unavailable"
                        }
                    >
                        {product.stock > 0
                            ? `${product.stock} adet`
                            : "Tükendi"}
                    </span>
                </div>

                <h2>{product.name}</h2>

                <p className="product-description">
                    {product.description}
                </p>

                {product.sellerId?.name && (
                    <p className="seller-name">
                        Satıcı: {product.sellerId.name}
                    </p>
                )}

                <div className="product-card-footer">
                    <strong className="product-price">
                        {formatPrice(product.price)}
                    </strong>

                    <Link
                        to={`/products/${product._id}`}
                        className="button"
                    >
                        İncele
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;