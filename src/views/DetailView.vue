<template>
  <div class="min-h-screen bg-gray-100 overflow-hidden">
    <div class="w-full max-w-7xl bg-white min-h-screen mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
      <!-- Header -->
      <div class="relative">
        <!-- Back Button -->
        <button
          @click="navigateBack"
          class="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition duration-200"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Main Image -->
        <div class="relative h-[60vh] sm:h-[70vh] md:h-[80vh] max-h-[90vh] bg-gray-200">
          <img
            v-if="content"
            :src="content.mainImage"
            :alt="content.title"
            class="w-full h-full object-cover object-center"
            @error="handleImageError"
          />
          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent/30 to-transparent"></div>

          <!-- Title Overlay -->
          <div
            v-if="content"
            class="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6"
          >
            <div class="flex flex-col gap-1 px-3 py-2">
              <span
                class="text-xs sm:text-sm font-medium text-white uppercase tracking-wide w-fit"
                style="text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9)"
              >
                Major Update
              </span>
              <h1
                class="text-base sm:text-2xl font-bold text-white leading-snug w-fit"
                style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 1)"
              >
                {{ content.title }}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <!-- Logo / Info / Refresh -->
      <div class="border-b border-gray-200 pb-4 mb-4">
        <div
          class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-4"
        >
          <!-- Logo & Info -->
          <div class="flex gap-4 items-center">
            <img
              :src="content.logo"
              :alt="`${content.title} logo`"
              class="w-14 h-14 object-cover rounded-lg shrink-0"
              @error="handleLogoError"
            />
            <div class="flex flex-col">
              <h2 class="text-base sm:text-lg md:text-xl font-semibold text-gray-900 break-words">
                {{ content.title }}
              </h2>
              <p class="text-sm text-gray-500">{{ content.subTitle }}</p>
            </div>
          </div>

          <!-- Refresh Button -->
          <div class="sm:mt-0 mt-2 sm:self-start self-end text-right">
            <button
              @click="handleRefresh"
              :disabled="contentStore.isLoading"
              class="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition duration-200"
            >
              <span v-if="contentStore.isLoading">...</span>
              <span v-else>REFRESH</span>
            </button>
            <span class="block text-xs text-gray-500 mt-1">In-App Purchase</span>
          </div>
        </div>
      </div>

      <!-- Main Text -->
      <div class="p-4 sm:p-6">
        <div
          v-if="content && content.text"
          class="prose prose-gray max-w-none text-sm sm:text-base"
        >
          <div v-html="sanitizedContent" class="text-gray-700 leading-relaxed"></div>
        </div>

        <div v-else-if="content" class="text-gray-700 text-sm sm:text-base leading-relaxed">
          <p>{{ content.subTitle }}</p>
        </div>

        <!-- Footer -->
        <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-b border-gray-200">
          <div class="flex flex-col items-center justify-center space-y-3 text-center">
            <img
              :src="content.logo"
              :alt="`${content.title} logo`"
              class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
              @error="handleLogoError"
            />
            <div>
              <h3 class="font-semibold text-gray-900 text-base sm:text-lg">
                {{ content.title }}
              </h3>
              <p class="text-sm text-gray-500">{{ content.subTitle }}</p>
            </div>
          </div>

          <!-- Footer Refresh -->
          <div class="mt-4 sm:mt-6 text-center">
            <button
              @click="handleRefresh"
              :disabled="contentStore.isLoading"
              class="bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 transition duration-200 text-sm sm:text-base"
            >
              <span v-if="contentStore.isLoading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading...
              </span>
              <span v-else>REFRESH</span>
            </button>
          </div>

          <div class="mt-3 text-center text-sm text-gray-500">
            <p>In-App Purchase</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useContentStore } from "@/stores/content";

const router = useRouter();
const contentStore = useContentStore();

const content = computed(() => contentStore.formattedContent);

const sanitizedContent = computed(() => {
  if (!content.value?.text) return "";

  // Step 1: Sanitize
  let cleanHtml = content.value.text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/javascript:/gi, "");

  // Step 2: Match paragraphs
  const paragraphs = [...cleanHtml.matchAll(/<p[^>]*>(.*?)<\/p>/gis)].map(
    (match) => match[1]
  );

  if (paragraphs.length === 0) return cleanHtml;

  // Step 3: Bold first 3 words
  const processedParagraphs = paragraphs.map((text) => {
    const words = text.trim().split(/\s+/);
    const firstThree = words.slice(0, 3).join(" ");
    const rest = words.slice(3).join(" ");
    return `<p><strong>${firstThree}</strong>${rest ? " " + rest : ""}</p>`;
  });

  // Step 4: Insert thumbnail image in middle
  const midpoint = Math.ceil(processedParagraphs.length / 2);
  const firstHalf = processedParagraphs.slice(0, midpoint);
  const secondHalf = processedParagraphs.slice(midpoint);

  const imageHTML = content.value.thumbNailImage
    ? `<div class="my-6 flex justify-center"><img src="${content.value.thumbNailImage}" alt="Thumbnail" class="w-full max-w-screen-md h-auto rounded-lg shadow-md object-contain" /></div>`
    : "";

  return [...firstHalf, imageHTML, ...secondHalf].join("");
});

const navigateBack = () => {
  contentStore.showCard();
  router.push("/card");
};

const handleRefresh = async () => {
  try {
    await contentStore.refreshContent();
  } catch (error) {
    console.error("Refresh failed:", error);
  }
};

const handleImageError = (event) => {
  event.target.src = "/placeholder-image.jpg";
};

const handleLogoError = (event) => {
  event.target.src = "/placeholder-logo.jpg";
};
</script>

<style scoped>
.prose p {
  margin-bottom: 1rem;
}

.prose h1,
.prose h2,
.prose h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.25rem;
}
</style>
