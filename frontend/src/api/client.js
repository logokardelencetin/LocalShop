const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001/api";

export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

const getToken = () => {
    return localStorage.getItem("localshop_token");
};

const request = async (
    path,
    {
        method = "GET",
        body,
    } = {}
) => {
    const headers = new Headers();

    if (body !== undefined) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    const token = getToken();

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const response = await fetch(
        `${API_URL}${path}`,
        {
            method,
            headers,
            body:
                body !== undefined
                    ? JSON.stringify(body)
                    : undefined,
        }
    );

    const contentType =
        response.headers.get("content-type");

    const data =
        contentType?.includes("application/json")
            ? await response.json()
            : null;

    if (!response.ok) {
        throw new ApiError(
            data?.message || "Request failed",
            response.status,
            data
        );
    }

    return data;
};

export const api = {
    get: (path) =>
        request(path),

    post: (path, body) =>
        request(path, {
            method: "POST",
            body,
        }),

    put: (path, body) =>
        request(path, {
            method: "PUT",
            body,
        }),

    patch: (path, body) =>
        request(path, {
            method: "PATCH",
            body,
        }),

    delete: (path) =>
        request(path, {
            method: "DELETE",
        }),
};