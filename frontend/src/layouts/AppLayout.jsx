import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const AppLayout = () => {
    const {
        user,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        navigate("/login");
    };

    const navClass = ({
        isActive,
    }) =>
        isActive
            ? "nav-link active"
            : "nav-link";

    return (
        <>
            <header className="header">
                <div className="header-inner">
                    <Link
                        to="/products"
                        className="brand"
                    >
                        LocalShop
                    </Link>

                    <nav className="navigation">
                        <NavLink
                            to="/products"
                            className={navClass}
                        >
                            Ürünler
                        </NavLink>

                        {user?.role ===
                            "customer" && (
                                <>
                                    <NavLink
                                        to="/cart"
                                        className={navClass}
                                    >
                                        Sepet
                                    </NavLink>

                                    <NavLink
                                        to="/orders"
                                        className={navClass}
                                    >
                                        Siparişlerim
                                    </NavLink>
                                </>
                            )}

                        {user?.role ===
                            "seller" && (
                                <>
                                    <NavLink
                                        to="/seller"
                                        className={navClass}
                                    >
                                        Satıcı Paneli
                                    </NavLink>

                                    <NavLink
                                        to="/seller/products/add"
                                        className={navClass}
                                    >
                                        Ürün Ekle
                                    </NavLink>
                                </>
                            )}
                    </nav>

                    <div className="header-actions">
                        {user ? (
                            <>
                                <span className="user-info">
                                    {user.name}
                                    {" · "}
                                    {user.role}
                                </span>

                                <button
                                    type="button"
                                    className="button secondary"
                                    onClick={
                                        handleLogout
                                    }
                                >
                                    Çıkış
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="button secondary"
                                >
                                    Giriş
                                </Link>

                                <Link
                                    to="/register"
                                    className="button"
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>
        </>
    );
};

export default AppLayout;