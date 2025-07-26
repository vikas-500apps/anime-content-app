<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-sm mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-500">{{ contentStore.currentDate }}</span>
          <button @click="handleLogout" class="text-sm text-gray-500 hover:text-gray-700 transition duration-200">
            Logout {{ contentStore.userName }}
          </button>
        </div>
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">Today</h1>
          <div class="flex items-center gap-2">
            <div v-if="content"
              class="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-semibold uppercase">
              {{ getInitials(content.userName) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content Card -->
      <div v-if="content" class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Main Image -->
        <div class="relative h-80 bg-gray-200 cursor-pointer group" @click="navigateToDetail">
          <img :src="content.thumbNailImage" :alt="content.title"
            class="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            @error="handleImageError" />
        </div>

        <!-- Info Section -->
        <div class="p-6">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <!-- Logo and Title/Subtitle -->
            <div class="flex gap-4">
              <img :src="content.logo" :alt="`${content.title} logo`" class="w-14 h-14 object-cover rounded-lg shrink-0"
                @error="handleLogoError" />
              <div class="flex flex-col justify-center">
                <h2 class="text-lg font-semibold text-gray-900 break-words">
                  {{ content.title }}
                </h2>
                <p class="text-sm text-gray-500">{{ content.subTitle }}</p>
              </div>
            </div>

            <!-- Refresh and In-App Purchase Buttons -->
            <div class="sm:mt-0 mt-2 sm:self-start self-end flex flex-col gap-2">
              <button @click="handleRefresh" :disabled="contentStore.isLoading"
                class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition duration-200">
                <span v-if="contentStore.isLoading">...</span>
                <span v-else>REFRESH</span>
              </button>
              <span class="block text-xs text-gray-500">In-App Purchase</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!contentStore.isLoading" class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
        <p class="text-gray-500 mb-4">Try refreshing to load new content</p>
        <button @click="handleRefresh"
          class="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition duration-200">
          Refresh
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useContentStore } from '@/stores/content'

 /**
  * Card View Component
  * Displays anime content in card format with navigation to detail view
  */ 
const router = useRouter()
const contentStore = useContentStore()

// Computed properties
const content = computed(() => contentStore.formattedContent)

// Navigate to detail view
const navigateToDetail = () => {
  if (content.value) {
    contentStore.showDetail()
    router.push('/detail')
  }
}

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  const first = parts[0]?.[0] || ''
  const last = parts[1]?.[0] || ''
  return (first + last).toUpperCase()
}

// Handle refresh button click
const handleRefresh = async () => {
  try {
    await contentStore.refreshContent()
  } catch (error) {
    console.error('Refresh failed:', error)
  }
}

// Handle logout
const handleLogout = () => {
  contentStore.logout()
  router.push('/login')
}

// Handle image loading errors
const handleImageError = (event) => {
  event.target.src = '/placeholder-image.jpg'
}

// Handle logo loading errors
const handleLogoError = (event) => {
  event.target.src = '/placeholder-logo.jpg'
}

// Load content on component mount
onMounted(async () => {
  await handleRefresh()
})
</script>
