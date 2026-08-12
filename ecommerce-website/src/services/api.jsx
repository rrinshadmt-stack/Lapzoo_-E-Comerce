import axios from "axios";

const api = axios.create({
  baseURL: "https://lapzoo-e-comerce.onrender.com/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        await axios.post(
          "https://lapzoo-e-comerce.onrender.com/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Retry 
        return api(original);
      } catch {
        // Redirect 
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
