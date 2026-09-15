import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("campusmart_admin_token");
    const studentToken = localStorage.getItem("campusmart_token");

    const adminUserRaw = localStorage.getItem("campusmart_admin_user");

    let adminUser = null;

    try {
      adminUser = adminUserRaw
        ? JSON.parse(adminUserRaw)
        : null;
    } catch {
      adminUser = null;
    }

    const isAdmin =
      Boolean(adminToken) &&
      String(adminUser?.role || "").toLowerCase() === "admin";

    const token = isAdmin ? adminToken : studentToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;