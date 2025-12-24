import axios from "axios";

const api = axios.create({
  // This tells React: "If there is a VITE_API_URL, use it. If not, use localhost."
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;