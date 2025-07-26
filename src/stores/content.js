import { defineStore } from "pinia"
import apiService from "@/services/api"

/**
 * Content Store - Manages application state for anime content
 * Handles authentication, content fetching, and error states
 */
export const useContentStore = defineStore("content", {
  state: () => ({
    // Authentication state
    isAuthenticated: false,
    userEmail: localStorage.getItem("user_email") || "",

    // Content state
    currentContent: null,
    contentHistory: [],

    // UI state
    isLoading: false,
    error: null,

    // Navigation state
    currentView: "card", // 'card' or 'detail'
  }),

  getters: {
    /**
     * Get formatted content for display
     */
    formattedContent: (state) => {
      if (!state.currentContent) return null

      return {
        ...state.currentContent,
        // Parse HTML content to plain text for preview
        textPreview: state.currentContent.text
          ? state.currentContent.text.replace(/<[^>]*>/g, "").substring(0, 200) + "..."
          : "",
        // Ensure images have fallbacks
        thumbNailImage: state.currentContent.thumbNailImage || "/placeholder-image.jpg",
        mainImage: state.currentContent.mainImage || "/placeholder-image.jpg",
        logo: state.currentContent.logo || "/placeholder-logo.jpg",
      }
    },

    /**
     * Check if content is available
     */
    hasContent: (state) => !!state.currentContent,

    /**
     * Get current date formatted
     */
    currentDate: () => {
      const now = new Date()
      return now
        .toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
        .toUpperCase()
    },
  },

  actions: {
    /**
     * Authenticate user with email
     * @param {string} email - User email
     */
    async authenticate(email) {
      this.isLoading = true
      this.error = null

      try {
        await apiService.generateToken(email)
        this.isAuthenticated = true
        this.userEmail = email
        localStorage.setItem("user_email", email)

        // Fetch initial content after authentication
        await this.fetchContent()
      } catch (error) {
        this.error = error.message
        this.isAuthenticated = false
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Fetch new content from API
     */
    async fetchContent() {
      this.isLoading = true
      this.error = null

      try {
        const content = await apiService.getContent()

        // Add to history if it's different content
        if (this.currentContent && this.currentContent.id !== content.id) {
          this.contentHistory.unshift(this.currentContent)
          // Keep only last 10 items in history
          this.contentHistory = this.contentHistory.slice(0, 10)
        }

        this.currentContent = content
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Refresh content (fetch new content)
     */
    async refreshContent() {
      await this.fetchContent()
    },

    /**
     * Navigate to detail view
     */
    showDetail() {
      this.currentView = "detail"
    },

    /**
     * Navigate back to card view
     */
    showCard() {
      this.currentView = "card"
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null
    },

    /**
     * Logout user
     */
    logout() {
      this.isAuthenticated = false
      this.userEmail = ""
      this.currentContent = null
      this.contentHistory = []
      this.currentView = "card"

      apiService.clearToken()
      localStorage.removeItem("user_email")
    },

    /**
     * Initialize store on app start
     */
    async initialize() {
      // Check if user was previously authenticated
      if (apiService.isAuthenticated() && this.userEmail) {
        this.isAuthenticated = true
        try {
          await this.fetchContent()
        } catch (error) {
          // If content fetch fails, user needs to re-authenticate
          this.logout()
        }
      }
    },
  },
})
