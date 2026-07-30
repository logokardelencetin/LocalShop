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

const formatPrice = (price) => {
    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
    }).format(price);
};

const PaymentPage = () => {
    const { orderId } = useParams();

    const navigate = useNavigate();

    const [order, setOrder] =
        useState(null);

    const [form, setForm] =
        useState({
            cardNumber: "",
            cardHolder: "",
            expiry: "",
            cvv: "",
        });

    const [loading, setLoading] =
        useState(true);

    const [paying, setPaying] =
        useState(false);

    const [error, setError] =
        useState("");

    const [paymentStatus, setPaymentStatus] =
        useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/orders/${orderId}`
                    );

                setOrder(
                    response.data.order
                );
            } catch (error) {
                setError(
                    error.message ||
                    "Sipariş yüklenemedi."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

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

        try {
            setPaying(true);
            setError("");
            setPaymentStatus("");

            const response =
                await api.post(
                    "/payments/pay",
                    {
                        orderId,
                        cardNumber:
                            form.cardNumber,
                        cardHolder:
                            form.cardHolder,
                        expiry:
                            form.expiry,
                        cvv:
                            form.cvv,
                    }
                );

            setPaymentStatus(
                response.data.order.status
            );

            navigate("/orders", {
                replace: true,
                state: {
                    message:
                        "Ödeme başarıyla tamamlandı.",
                },
            });
        } catch (error) {
            const status =
                error.data?.data?.order
                    ?.status;

            if (status) {
                setPaymentStatus(status);
            }

            setError(
                error.message ||
                "Ödeme gerçekleştirilemedi."
            );
        } finally {
            setPaying(false);
        }
    };

    if (loading) {
        return (
            <div className="page-message">
                Sipariş yükleniyor...
            </div>
        );
    }

    if (!order) {
        return (
            <section>
                <div className="alert error-alert">
                    {error || "Sipariş bulunamadı."}
                </div>

                <Link
                    to="/orders"
                    className="back-link"
                >
                    ← Siparişlere dön
                </Link>
            </section>
        );
    }

    const alreadyPaid = [
        "PAID",
        "SHIPPED",
        "DELIVERED",
    ].includes(order.status);

    return (
        <section>
            <Link
                to="/orders"
                className="back-link"
            >
                ← Siparişlere dön
            </Link>

            <div className="page-heading">
                <div>
                    <h1>Ödeme</h1>

                    <p className="muted">
                        Sipariş #
                        {order._id.slice(-8)}
                    </p>
                </div>
            </div>

            <div className="payment-layout">
                <div className="card">
                    <h2>Kart Bilgileri</h2>

                    <div className="test-cards">
                        <div>
                            <strong>
                                Başarılı test kartı
                            </strong>

                            <code>
                                4242424242424242
                            </code>
                        </div>

                        <div>
                            <strong>
                                Başarısız test kartı
                            </strong>

                            <code>
                                4000000000000000
                            </code>
                        </div>
                    </div>

                    {error && (
                        <div className="alert error-alert">
                            {error}

                            {paymentStatus && (
                                <div>
                                    Durum:{" "}
                                    <strong>
                                        {paymentStatus}
                                    </strong>
                                </div>
                            )}
                        </div>
                    )}

                    {alreadyPaid ? (
                        <div className="alert success-alert">
                            Bu siparişin ödemesi
                            tamamlanmış.
                        </div>
                    ) : (
                        <form
                            className="form"
                            onSubmit={
                                handleSubmit
                            }
                        >
                            <label>
                                Kart Numarası

                                <input
                                    name="cardNumber"
                                    value={
                                        form.cardNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="4242424242424242"
                                    inputMode="numeric"
                                    required
                                />
                            </label>

                            <label>
                                Kart Sahibi

                                <input
                                    name="cardHolder"
                                    value={
                                        form.cardHolder
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="TEST CUSTOMER"
                                    required
                                />
                            </label>

                            <div className="form-row">
                                <label>
                                    Son Kullanma

                                    <input
                                        name="expiry"
                                        value={
                                            form.expiry
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="12/30"
                                        required
                                    />
                                </label>

                                <label>
                                    CVV

                                    <input
                                        name="cvv"
                                        value={form.cvv}
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="123"
                                        inputMode="numeric"
                                        required
                                    />
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="button full"
                                disabled={paying}
                            >
                                {paying
                                    ? "Ödeme yapılıyor..."
                                    : `${formatPrice(
                                        order.totalPrice
                                    )} Öde`}
                            </button>
                        </form>
                    )}
                </div>

                <aside className="card payment-summary">
                    <h2>Sipariş Özeti</h2>

                    <div className="payment-items">
                        {order.items.map(
                            (item) => (
                                <div
                                    className="payment-item"
                                    key={
                                        item.productId
                                    }
                                >
                                    <div>
                                        <strong>
                                            {item.name}
                                        </strong>

                                        <span className="muted">
                                            {item.quantity} adet
                                        </span>
                                    </div>

                                    <strong>
                                        {formatPrice(
                                            item.subtotal
                                        )}
                                    </strong>
                                </div>
                            )
                        )}
                    </div>

                    <div className="summary-row total">
                        <span>Toplam</span>

                        <strong>
                            {formatPrice(
                                order.totalPrice
                            )}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Durum</span>

                        <strong>
                            {order.status}
                        </strong>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default PaymentPage;