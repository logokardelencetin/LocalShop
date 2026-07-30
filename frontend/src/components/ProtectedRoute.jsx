import {
    Navigate,
    Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const {
        isAuthenticated,
        initializing,
    } = useAuth();

    if (initializing) {
        return (
            <div className="page-message">
                Oturum kontrol ediliyor...
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;