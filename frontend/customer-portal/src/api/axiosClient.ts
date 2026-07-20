import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://13.234.48.49:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token for protected APIs
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
