// Axios client wired to the real Express/MongoDB backend in /backend.
// Set VITE_USE_MOCK=false in frontend/.env (and VITE_API_URL to your
// deployed API) to switch the whole app from the standalone demo data
// in mockApi.js over to this live client. Components consume the same
// shaped responses either way.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://internship-project-spms.onrender.com/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("spms_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || { message: "Network error" })
);

export default api;
