import axios from "axios";

// Lấy baseURL: ưu tiên localStorage (API custom), fallback .env
export function getBaseUrl() {
  const savedUrl = localStorage.getItem("apiBaseUrl");
  return savedUrl || process.env.REACT_APP_API_URL;
}

// Tạo Axios instance
const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

export default api;
