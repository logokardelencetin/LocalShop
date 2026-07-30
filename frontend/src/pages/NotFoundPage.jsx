import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <section>
            <h1>404</h1>

            <p>
                Aradığınız sayfa bulunamadı.
            </p>

            <Link to="/products">
                Ürünlere dön
            </Link>
        </section>
    );
};

export default NotFoundPage;