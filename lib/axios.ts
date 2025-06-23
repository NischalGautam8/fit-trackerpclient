import axios from "axios"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      window.location.href = "/login"
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api
