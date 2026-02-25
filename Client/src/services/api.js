import axios from "axios";

const API = axios.create({
  baseURL: "https://laughing-train-pvxg9qwxx75cr57-5000.app.github.dev",
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;