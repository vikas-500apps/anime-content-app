import { describe, it, expect, beforeEach, vi } from "vitest"
import axios from "axios"
import apiService from "@/services/api"

// Mock axios
vi.mock("axios")

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  describe("Token Generation", () => {
    it("should generate token successfully", async () => {
      const mockResponse = {
        data: { token: "mock-token-123" },
      }

      axios.create.mockReturnValue({
        post: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })

      const token = await apiService.generateToken("test@example.com")

      expect(token).toBe("mock-token-123")
      expect(localStorage.getItem("auth_token")).toBe("mock-token-123")
    })

    it("should handle token generation failure", async () => {
      const mockError = new Error("Network error")

      axios.create.mockReturnValue({
        post: vi.fn().mockRejectedValue(mockError),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })

      await expect(apiService.generateToken("test@example.com")).rejects.toThrow("Network error")
    })
  })

  describe("Content Fetching", () => {
    it("should fetch content successfully", async () => {
      const mockContent = { id: 1, title: "Test Anime" }
      const mockResponse = {
        data: { content: mockContent },
      }

      apiService.token = "mock-token"

      axios.create.mockReturnValue({
        get: vi.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })

      const content = await apiService.getContent()

      expect(content).toEqual(mockContent)
    })

    it("should throw error when no token available", async () => {
      apiService.token = null

      await expect(apiService.getContent()).rejects.toThrow("No authentication token available")
    })
  })

  describe("Authentication Status", () => {
    it("should return true when token exists", () => {
      apiService.token = "mock-token"
      expect(apiService.isAuthenticated()).toBe(true)
    })

    it("should return false when no token", () => {
      apiService.token = null
      expect(apiService.isAuthenticated()).toBe(false)
    })
  })
})
