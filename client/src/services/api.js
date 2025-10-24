import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_URL_API,
  timeout: 5000,
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
