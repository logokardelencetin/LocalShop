import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

import { api } from "../../api/client";
import ProductForm from "../../components/ProductForm";

const AddProductPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            setError("");

            await api.post(
                "/products",
                values
            );

            navigate("/seller", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.message ||
                "Ürün eklenemedi."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <Link
                to="/seller"
                className="back-link"
            >
                ← Satıcı paneline dön
            </Link>

            <div className="page-heading">
                <div>
                    <h1>Ürün Ekle</h1>

                    <p className="muted">
                        Yeni ürün bilgilerini
                        girin.
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            <div className="card seller-form-card">
                <ProductForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitText="Ürün Ekle"
                />
            </div>
        </section>
    );
};

export default AddProductPage;