import {
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
    const navigate =
        useNavigate();

    const { register } =
        useAuth();

    const [form, setForm] =
        useState({
            name: "",
            email: "",
            password: "",
            role: "customer",
        });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await register(form);

            navigate(
                "/login",
                {
                    replace: true,
                    state: {
                        message:
                            "Kayıt başarılı. Şimdi giriş yapabilirsiniz.",
                    },
                }
            );
        } catch (error) {
            setError(
                error.message ||
                "Kayıt oluşturulamadı."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="card auth-card">
                <h1>Kayıt Ol</h1>

                <p className="muted">
                    Customer veya seller
                    hesabı oluşturabilirsiniz.
                </p>

                {error && (
                    <div className="alert error-alert">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="form"
                >
                    <label>
                        Ad Soyad
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={
                                handleChange
                            }
                            required
                            minLength={2}
                        />
                    </label>

                    <label>
                        E-posta
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={
                                handleChange
                            }
                            required
                        />
                    </label>

                    <label>
                        Şifre
                        <input
                            type="password"
                            name="password"
                            value={
                                form.password
                            }
                            onChange={
                                handleChange
                            }
                            required
                            minLength={6}
                        />
                    </label>

                    <label>
                        Hesap Türü

                        <select
                            name="role"
                            value={form.role}
                            onChange={
                                handleChange
                            }
                        >
                            <option value="customer">
                                Customer
                            </option>

                            <option value="seller">
                                Seller
                            </option>
                        </select>
                    </label>

                    <button
                        type="submit"
                        className="button full"
                        disabled={loading}
                    >
                        {loading
                            ? "Kaydediliyor..."
                            : "Kayıt Ol"}
                    </button>
                </form>

                <p className="auth-footer">
                    Zaten hesabınız var mı?{" "}
                    <Link to="/login">
                        Giriş yapın
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default RegisterPage;