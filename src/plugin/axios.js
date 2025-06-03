import axios from "axios"

// Create a global axios instance with default configuration
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add global request handling here
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // You can add global response handling here
    return response
  },
  (error) => {
    // Handle errors globally
    console.error("API Error:", error)

    // You can handle specific error codes here
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error("Unauthorized access")
          break
        case 404:
          console.error("Resource not found")
          break
        case 429:
          console.error("Too many requests - API rate limit exceeded")
          break
        case 500:
          console.error("Server error")
          break
        default:
          console.error(`Error: ${error.response.status}`)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
