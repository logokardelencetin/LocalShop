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
import ProductForm from "../../components/ProductForm";

const EditProductPage = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

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

    const handleSubmit = async (values) => {
        try {
            setSaving(true);
            setError("");

            await api.put(
                `/products/${id}`,
                values
            );

            navigate("/seller", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.message ||
                "Ürün güncellenemedi."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-message">
                Ürün yükleniyor...
            </div>
        );
    }

    return (
        <section>
            <Link
                to="/seller"
                className="back-link"
            >
                ← Satıcı paneline dön
            </Link>

            <h1>Ürünü Düzenle</h1>

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            {product && (
                <div className="card seller-form-card">
                    <ProductForm
                        initialValues={product}
                        onSubmit={handleSubmit}
                        loading={saving}
                        submitText="Değişiklikleri Kaydet"
                    />
                </div>
            )}
        </section>
    );
};

export default EditProductPage;