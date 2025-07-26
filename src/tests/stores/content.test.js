import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useContentStore } from "@/stores/content"
import apiService from "@/services/api"

// Mock the API service
vi.mock("@/services/api", () => ({
  default: {
    generateToken: vi.fn(),
    getContent: vi.fn(),
    isAuthenticated: vi.fn(),
    clearToken: vi.fn(),
  },
}))

describe("Content Store", () => {
  let store

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useContentStore()
    vi.clearAllMocks()
  })

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      expect(store.isAuthenticated).toBe(false)
      expect(store.currentContent).toBe(null)
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.currentView).toBe("card")
    })
  })

  describe("Authentication", () => {
    it("should authenticate user successfully", async () => {
      const mockToken = "mock-token"
      const mockEmail = "test@example.com"
      const mockContent = { id: 1, title: "Test Anime" }

      apiService.generateToken.mockResolvedValue(mockToken)
      apiService.getContent.mockResolvedValue(mockContent)

      await store.authenticate(mockEmail)

      expect(store.isAuthenticated).toBe(true)
      expect(store.userEmail).toBe(mockEmail)
      expect(store.currentContent).toEqual(mockContent)
      expect(apiService.generateToken).toHaveBeenCalledWith(mockEmail)
    })

    it("should handle authentication failure", async () => {
      const mockError = new Error("Authentication failed")
      apiService.generateToken.mockRejectedValue(mockError)

      await expect(store.authenticate("test@example.com")).rejects.toThrow("Authentication failed")
      expect(store.isAuthenticated).toBe(false)
      expect(store.error).toBe("Authentication failed")
    })
  })

  describe("Content Management", () => {
    it("should fetch content successfully", async () => {
      const mockContent = { id: 1, title: "Test Anime", text: "<p>Test content</p>" }
      apiService.getContent.mockResolvedValue(mockContent)

      await store.fetchContent()

      expect(store.currentContent).toEqual(mockContent)
      expect(store.error).toBe(null)
    })

    it("should handle content fetch failure", async () => {
      const mockError = new Error("Content fetch failed")
      apiService.getContent.mockRejectedValue(mockError)

      await expect(store.fetchContent()).rejects.toThrow("Content fetch failed")
      expect(store.error).toBe("Content fetch failed")
    })

    it("should add content to history when fetching new content", async () => {
      const oldContent = { id: 1, title: "Old Anime" }
      const newContent = { id: 2, title: "New Anime" }

      store.currentContent = oldContent
      apiService.getContent.mockResolvedValue(newContent)

      await store.fetchContent()

      expect(store.currentContent).toEqual(newContent)
      expect(store.contentHistory).toContain(oldContent)
    })
  })

  describe("Getters", () => {
    it("should format content correctly", () => {
      const mockContent = {
        id: 1,
        title: "Test Anime",
        text: "<p>This is a long text content that should be truncated for preview</p>",
        thumbNailImage: "test-thumb.jpg",
        mainImage: "test-main.jpg",
        logo: "test-logo.jpg",
      }

      store.currentContent = mockContent
      const formatted = store.formattedContent

      expect(formatted.textPreview).toContain("This is a long text content")
      expect(formatted.textPreview).toContain("...")
      expect(formatted.thumbNailImage).toBe("test-thumb.jpg")
    })

    it("should provide fallback images for missing content", () => {
      const mockContent = {
        id: 1,
        title: "Test Anime",
        text: "Test content",
      }

      store.currentContent = mockContent
      const formatted = store.formattedContent

      expect(formatted.thumbNailImage).toBe("/placeholder-image.jpg")
      expect(formatted.mainImage).toBe("/placeholder-image.jpg")
      expect(formatted.logo).toBe("/placeholder-logo.jpg")
    })
  })

  describe("Navigation", () => {
    it("should navigate to detail view", () => {
      store.showDetail()
      expect(store.currentView).toBe("detail")
    })

    it("should navigate to card view", () => {
      store.currentView = "detail"
      store.showCard()
      expect(store.currentView).toBe("card")
    })
  })

  describe("Logout", () => {
    it("should clear all user data on logout", () => {
      store.isAuthenticated = true
      store.userEmail = "test@example.com"
      store.currentContent = { id: 1, title: "Test" }
      store.contentHistory = [{ id: 2, title: "History" }]

      store.logout()

      expect(store.isAuthenticated).toBe(false)
      expect(store.userEmail).toBe("")
      expect(store.currentContent).toBe(null)
      expect(store.contentHistory).toEqual([])
      expect(apiService.clearToken).toHaveBeenCalled()
    })
  })
})
