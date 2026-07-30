import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { api } from "../api/client";

const AuthContext = createContext(null);

const TOKEN_KEY = "localshop_token";
const USER_KEY = "localshop_user";

const getStoredUser = () => {
    try {
        const value =
            localStorage.getItem(USER_KEY);

        return value
            ? JSON.parse(value)
            : null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({
    children,
}) => {
    const [user, setUser] = useState(
        getStoredUser
    );

    const [initializing, setInitializing] =
        useState(true);

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
    };

    useEffect(() => {
        const checkSession = async () => {
            const token =
                localStorage.getItem(TOKEN_KEY);

            if (!token) {
                setInitializing(false);
                return;
            }

            try {
                const response =
                    await api.get("/auth/me");

                const currentUser =
                    response.data.user;

                setUser(currentUser);

                localStorage.setItem(
                    USER_KEY,
                    JSON.stringify(currentUser)
                );
            } catch {
                logout();
            } finally {
                setInitializing(false);
            }
        };

        checkSession();
    }, []);

    const login = async ({
        email,
        password,
    }) => {
        const response = await api.post(
            "/auth/login",
            {
                email,
                password,
            }
        );

        const {
            user: loggedInUser,
            token,
        } = response.data;

        localStorage.setItem(
            TOKEN_KEY,
            token
        );

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);

        return loggedInUser;
    };

    const register = async (values) => {
        return api.post(
            "/auth/register",
            values
        );
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                initializing,
                isAuthenticated: Boolean(user),
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context =
        useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};