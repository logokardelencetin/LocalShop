import {
    useEffect,
    useState,
} from "react";

import { api } from "../../api/client";
import ProductCard from "../../components/ProductCard";

const ProductListPage = () => {
    const [products, setProducts] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [filters, setFilters] =
        useState({
            search: "",
            category: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params =
                    new URLSearchParams();

                if (filters.search) {
                    params.set(
                        "search",
                        filters.search
                    );
                }

                if (filters.category) {
                    params.set(
                        "category",
                        filters.category
                    );
                }

                const queryString =
                    params.toString();

                const path = queryString
                    ? `/products?${queryString}`
                    : "/products";

                const response =
                    await api.get(path);

                setProducts(
                    response.data.products
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Ürünler yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    const handleSubmit = (event) => {
        event.preventDefault();

        setFilters({
            search: search.trim(),
            category:
                category.trim().toLowerCase(),
        });
    };

    const handleClear = () => {
        setSearch("");
        setCategory("");

        setFilters({
            search: "",
            category: "",
        });
    };

    return (
        <section>
            <div className="page-heading">
                <div>
                    <h1>Ürünler</h1>

                    <p className="muted">
                        Yerel üreticilerin
                        ürünlerini keşfedin.
                    </p>
                </div>
            </div>

            <form
                className="product-filters"
                onSubmit={handleSubmit}
            >
                <div className="filter-field">
                    <label htmlFor="search">
                        Ürün Ara
                    </label>

                    <input
                        id="search"
                        type="search"
                        placeholder="Örn. bal"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="filter-field">
                    <label htmlFor="category">
                        Kategori
                    </label>

                    <input
                        id="category"
                        type="text"
                        placeholder="Örn. food"
                        value={category}
                        onChange={(event) =>
                            setCategory(
                                event.target.value
                            )
                        }
                    />
                </div>

                <div className="filter-actions">
                    <button
                        type="submit"
                        className="button"
                        disabled={loading}
                    >
                        Filtrele
                    </button>

                    <button
                        type="button"
                        className="button secondary"
                        onClick={handleClear}
                        disabled={loading}
                    >
                        Temizle
                    </button>
                </div>
            </form>

            {loading && (
                <div className="page-message">
                    Ürünler yükleniyor...
                </div>
            )}

            {!loading && error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                products.length === 0 && (
                    <div className="empty-state">
                        <h2>Ürün bulunamadı</h2>

                        <p>
                            Arama veya kategori
                            filtrenizi değiştirmeyi
                            deneyin.
                        </p>
                    </div>
                )}

            {!loading &&
                !error &&
                products.length > 0 && (
                    <>
                        <p className="result-count">
                            {products.length} ürün
                            bulundu
                        </p>

                        <div className="product-grid">
                            {products.map(
                                (product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                    />
                                )
                            )}
                        </div>
                    </>
                )}
        </section>
    );
};

export default ProductListPage;