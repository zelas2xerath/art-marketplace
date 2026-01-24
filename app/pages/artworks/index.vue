<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-4">作品展示</h1>
        <p class="text-gray-600 text-lg">探索{{ totalCount }}件精彩作品</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <div class="flex flex-wrap gap-2">
          <button
              v-for="category in categories"
              :key="category.id"
              @click="selectedCategory = category.id"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedCategory === category.id
              ? 'bg-purple-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        <div v-for="i in 12" :key="i" class="break-inside-avoid">
          <div class="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div class="aspect-[3/4] bg-gray-200"></div>
            <div class="p-3 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="filteredArtworks.length === 0" class="text-center py-16">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500 text-lg">暂无作品</p>
      </div>

      <div v-else class="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        <div
            v-for="artwork in displayedArtworks"
            :key="artwork.id"
            class="break-inside-avoid"
        >
          <ArtworkCard :artwork="artwork" />
        </div>
      </div>

      <div v-if="hasMore" class="mt-8 text-center">
        <button
            @click="loadMore"
            :disabled="loadingMore"
            class="px-8 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const loadingMore = ref(false)
const selectedCategory = ref('all')
const displayCount = ref(24)

const categories = [
  { id: 'all', name: '全部' },
  { id: 'illustration', name: '插画' },
  { id: 'character', name: '角色设计' },
  { id: 'scene', name: '场景' },
  { id: 'portrait', name: '立绘' },
  { id: 'chibi', name: 'Q版' },
  { id: 'emoji', name: '表情包' },
]

const { data: artworksData } = await useFetch('/api/artworks')
const artworks = computed(() => artworksData.value || [])
const totalCount = computed(() => artworks.value.length)

const filteredArtworks = computed(() => {
  if (selectedCategory.value === 'all') {
    return artworks.value
  }
  return artworks.value.filter(a => a.category === selectedCategory.value)
})

const displayedArtworks = computed(() => {
  return filteredArtworks.value.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  return displayCount.value < filteredArtworks.value.length
})

const loadMore = () => {
  loadingMore.value = true
  setTimeout(() => {
    displayCount.value += 24
    loadingMore.value = false
  }, 500)
}

watch(selectedCategory, () => {
  displayCount.value = 24
})
</script>