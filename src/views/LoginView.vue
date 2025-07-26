<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
        <p class="text-gray-600">Enter your email to access anime content</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
            placeholder="Enter your email"
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading || !email.trim()"
          class="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Authenticating...
          </span>
          <span v-else>Get Started</span>
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-500">
        <p>This will generate a token for accessing anime content</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'

/**
 * Login View Component
 * Handles user authentication with email
 */

const router = useRouter()
const contentStore = useContentStore()

// Reactive data
const email = ref('')

// Computed properties
const isLoading = computed(() => contentStore.isLoading)

/**
 * Handle login form submission
 */
const handleLogin = async () => {
  try {
    await contentStore.authenticate(email.value.trim())
    router.push('/card')
  } catch (error) {
    // Error is handled by the store and displayed via ErrorToast
    console.error('Login failed:', error)
  }
}
</script>
