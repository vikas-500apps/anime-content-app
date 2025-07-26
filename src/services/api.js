import axios from "axios"

/**
 * API Service for handling authentication and content fetching
 * Implements proper error handling and token management
 */
class ApiService {
  constructor() {
    this.baseURL = "https://swsut62sse.execute-api.ap-south-1.amazonaws.com/prod"
    this.contentURL = "https://tzab40im77.execute-api.ap-south-1.amazonaws.com/prod"
    this.token = localStorage.getItem("auth_token")

    // Create axios instance for auth
    this.authClient = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Create axios instance for content
    this.contentClient = axios.create({
      baseURL: this.contentURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add request interceptor for content client
    this.contentClient.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Add response interceptor for error handling
    this.setupResponseInterceptors()
  }

  /**
   * Setup response interceptors for both clients
   */
  setupResponseInterceptors() {
    const handleResponse = (response) => response
    const handleError = (error) => {
      console.error("API Error:", error)

      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response
        throw new Error(`API Error ${status}: ${data.message || "Unknown error"}`)
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("Network error: No response from server")
      } else {
        // Something else happened
        throw new Error(`Request error: ${error.message}`)
      }
    }

    this.authClient.interceptors.response.use(handleResponse, handleError)
    this.contentClient.interceptors.response.use(handleResponse, handleError)
  }

  /**
   * Generate authentication token
   * @param {string} email - User email address
   * @returns {Promise<string>} Authentication token
   */
  async generateToken(email) {
    try {
      const response = await this.authClient.post("/generateToken", { email })
      const { token } = response.data

      if (!token) {
        throw new Error("No token received from server")
      }

      this.token = token
      localStorage.setItem("auth_token", token)

      return token
    } catch (error) {
      console.error("Token generation failed:", error)
      throw error
    }
  }

  /**
   * Fetch anime content
   * @returns {Promise<Object>} Content data
   */
  async getContent() {
    try {
      if (!this.token) {
        throw new Error("No authentication token available")
      }

      const response = await this.contentClient.get("/getContent")
      return response.data.content
    } catch (error) {
      console.error("Content fetch failed:", error)
      throw error
    }
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.token
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null
    localStorage.removeItem("auth_token")
  }
}

export default new ApiService()
