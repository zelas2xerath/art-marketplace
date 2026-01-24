<template>
  <NuxtLink
      :to="`/artists/${artist.id}`"
      class="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
          :src="artist.avatar_url || '/placeholder-artist.jpg'"
          :alt="artist.display_name"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      />
      <div class="absolute top-3 right-3">
        <span
            class="px-3 py-1 rounded-full text-xs font-medium"
            :class="statusClass"
        >
          {{ statusText }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="font-semibold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
        {{ artist.display_name }}
      </h3>

      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        {{ artist.bio }}
      </p>

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center gap-1 text-amber-500">
          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="font-medium">{{ artist.rating?.toFixed(1) || '5.0' }}</span>
        </div>

        <div class="text-gray-500">
          <span>{{ artist.total_sales || 0 }}</span>
          <span class="ml-1">订单</span>
        </div>
      </div>

      <div class="mt-3 pt-3 border-t border-gray-100">
        <div class="text-purple-600 font-bold text-lg">
          ¥{{ artist.base_price?.toLocaleString() || '0' }}
          <span class="text-sm text-gray-500 font-normal">起</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  artist: {
    id: string
    display_name: string
    avatar_url?: string
    bio?: string
    status?: 'ready' | 'busy' | 'offline'
    rating?: number
    total_sales?: number
    base_price?: number
  }
}>()

const statusText = computed(() => {
  const map = {
    ready: '接单中',
    busy: '忙碌',
    offline: '休息中'
  }
  return map[props.artist.status || 'offline'] || '未知'
})

const statusClass = computed(() => {
  const map = {
    ready: 'bg-green-100 text-green-800',
    busy: 'bg-amber-100 text-amber-800',
    offline: 'bg-gray-100 text-gray-800'
  }
  return map[props.artist.status || 'offline'] || 'bg-gray-100 text-gray-800'
})
</script>