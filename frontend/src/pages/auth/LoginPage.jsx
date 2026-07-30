import {
    useState,
} from "react";

import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
    const navigate =
        useNavigate();

    const location =
        useLocation();

    const { login } =
        useAuth();

    const [form, setForm] =
        useState({
            email: "",
            password: "",
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
            const user =
                await login(form);

            if (user.role === "seller") {
                navigate(
                    "/seller",
                    {
                        replace: true,
                    }
                );
            } else {
                navigate(
                    "/products",
                    {
                        replace: true,
                    }
                );
            }
        } catch (error) {
            setError(
                error.message ||
                "Giriş yapılamadı."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-page">
            <div className="card auth-card">
                <h1>Giriş Yap</h1>

                <p className="muted">
                    LocalShop hesabınıza giriş
                    yapın.
                </p>

                {location.state?.message && (
                    <div className="alert success-alert">
                        {
                            location.state
                                .message
                        }
                    </div>
                )}

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
                        />
                    </label>

                    <button
                        type="submit"
                        className="button full"
                        disabled={loading}
                    >
                        {loading
                            ? "Giriş yapılıyor..."
                            : "Giriş Yap"}
                    </button>
                </form>

                <p className="auth-footer">
                    Hesabınız yok mu?{" "}
                    <Link to="/register">
                        Kayıt olun
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default LoginPage;