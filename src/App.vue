<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <!-- Global Loading Overlay -->
    <LoadingOverlay v-if="contentStore.isLoading" />
    
    <!-- Global Error Toast -->
    <ErrorToast 
      v-if="contentStore.error" 
      :message="contentStore.error"
      @close="contentStore.clearError"
    />
    
    <!-- Router View with Transitions -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useContentStore } from '@/stores/content'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import ErrorToast from '@/components/ErrorToast.vue'

const contentStore = useContentStore()

// Initialize the application
// Check authentication status and fetch initial data
onMounted(async () => {
  await contentStore.initialize()
})
</script>

<style scoped>
/* Component-specific styles */
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
</style>
