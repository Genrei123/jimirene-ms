import axios from 'axios';

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the Authorization header
axiosInstance.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Handle request errors
});

// List of protected routes
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  // Add other protected routes here
];

// Interceptor to handle errors such as 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: Token expired or invalid. Redirecting to login.");
      localStorage.removeItem("token"); // Remove the token

      // Check if the current URL is a protected route
      const currentPath = window.location.pathname;
      if (protectedRoutes.includes(currentPath)) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error); // Pass the error to the calling code
  }
);

export default axiosInstance;