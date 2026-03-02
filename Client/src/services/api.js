import axios from "axios";

const API = axios.create({
  baseURL:
    "https://laughing-train-pvxg9qwxx75cr57-5000.app.github.dev/",
});

// ✅ Attach access token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// ✅ AUTO REFRESH TOKEN LOGIC
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        const res = await axios.post(
          "https://laughing-train-pvxg9qwxx75cr57-5000.app.github.dev/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        // retry original request
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (refreshError) {
        // refresh failed → logout
        localStorage.clear();

        if (window.location.pathname !== "/login") {
          window.location.href =
            "/login?session=expired";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;