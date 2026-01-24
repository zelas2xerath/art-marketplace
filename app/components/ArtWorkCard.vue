<template>
  <NuxtLink
      :to="`/artworks/${artwork.id}`"
      class="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div class="relative aspect-3/4 overflow-hidden bg-gray-100">
      <img
          :src="artwork.image_url || '/placeholder-artwork.jpg'"
          :alt="artwork.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      <div class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <p class="text-sm line-clamp-2">{{ artwork.description }}</p>
        </div>
      </div>

      <div class="absolute top-3 right-3 flex gap-2">
        <button
            @click.prevent="toggleLike"
            class="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <svg
              class="w-5 h-5 transition-colors"
              :class="isLiked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-700'"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="p-3">
      <h3 class="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">
        {{ artwork.title }}
      </h3>

      <div class="flex items-center gap-2 text-sm text-gray-600">
        <img
            :src="artwork.artist?.avatar_url || '/default-avatar.jpg'"
            class="w-5 h-5 rounded-full"
        />
        <span class="line-clamp-1">{{ artwork.artist?.display_name }}</span>
      </div>

      <div class="flex items-center justify-between mt-2 text-sm">
        <div class="flex items-center gap-3 text-gray-500">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{{ artwork.like_count || 0 }}</span>
          </div>
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ artwork.view_count || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  artwork: {
    id: string
    title: string
    description?: string
    image_url?: string
    like_count?: number
    view_count?: number
    artist?: {
      display_name: string
      avatar_url?: string
    }
  }
}>()

const isLiked = ref(false)

const toggleLike = () => {
  isLiked.value = !isLiked.value
  // Implement like logic
}
</script>