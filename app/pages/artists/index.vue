<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b">
      <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold mb-4">发现优秀画师</h1>
        <p class="text-gray-600 text-lg">超过{{ totalCount }}位专业画师为您服务</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="flex gap-8">
        <aside class="hidden lg:block w-64 flex-shrink-0">
          <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100 sticky top-20">
            <h2 class="font-semibold text-lg mb-4">筛选条件</h2>

            <div class="space-y-6">
              <div>
                <h3 class="font-medium mb-3">画师状态</h3>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        v-model="filters.status"
                        value="ready"
                        class="w-4 h-4 text-purple-600 rounded"
                    />
                    <span class="text-sm">接单中</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        v-model="filters.status"
                        value="busy"
                        class="w-4 h-4 text-purple-600 rounded"
                    />
                    <span class="text-sm">忙碌</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 class="font-medium mb-3">价格区间</h3>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input
                        type="radio"
                        v-model="filters.priceRange"
                        value="0-500"
                        class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-sm">¥500以下</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                        type="radio"
                        v-model="filters.priceRange"
                        value="500-1000"
                        class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-sm">¥500-1000</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                        type="radio"
                        v-model="filters.priceRange"
                        value="1000-2000"
                        class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-sm">¥1000-2000</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input
                        type="radio"
                        v-model="filters.priceRange"
                        value="2000+"
                        class="w-4 h-4 text-purple-600"
                    />
                    <span class="text-sm">¥2000以上</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 class="font-medium mb-3">画风标签</h3>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="tag in styleTags"
                      :key="tag"
                      @click="toggleStyleTag(tag)"
                      class="px-3 py-1 rounded-full text-sm border transition-colors"
                      :class="filters.styleTags.includes(tag)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-600'"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>

              <button
                  @click="resetFilters"
                  class="w-full py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                重置筛选
              </button>
            </div>
          </div>
        </aside>

        <div class="flex-1">
          <div class="flex justify-between items-center mb-6">
            <div class="flex gap-2">
              <button
                  v-for="sort in sortOptions"
                  :key="sort.value"
                  @click="currentSort = sort.value"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  :class="currentSort === sort.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
              >
                {{ sort.label }}
              </button>
            </div>

            <div class="text-sm text-gray-600">
              找到 {{ filteredArtists.length }} 位画师
            </div>
          </div>

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="i in 6" :key="i" class="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div class="aspect-square bg-gray-200"></div>
              <div class="p-4 space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredArtists.length === 0" class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-500 text-lg mb-4">没有找到符合条件的画师</p>
            <button
                @click="resetFilters"
                class="text-purple-600 hover:underline"
            >
              清除筛选条件
            </button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArtistCard
                v-for="artist in paginatedArtists"
                :key="artist.id"
                :artist="artist"
            />
          </div>

          <div v-if="totalPages > 1" class="mt-8 flex justify-center gap-2">
            <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>

            <button
                v-for="page in displayPages"
                :key="page"
                @click="currentPage = page"
                class="px-4 py-2 rounded-lg transition-colors"
                :class="currentPage === page
                ? 'bg-purple-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'"
            >
              {{ page }}
            </button>

            <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false)
const currentPage = ref(1)
const pageSize = 12

const filters = ref({
  status: [] as string[],
  priceRange: '',
  styleTags: [] as string[],
})

const currentSort = ref('popular')

const sortOptions = [
  { label: '综合排序', value: 'popular' },
  { label: '最新入驻', value: 'newest' },
  { label: '价格最低', value: 'price_low' },
  { label: '价格最高', value: 'price_high' },
  { label: '好评最多', value: 'rating' },
]

const styleTags = [
  '日系', '欧美', '国风', '写实',
  '二次元', 'Q版', '厚涂', '平涂',
]

const { data: artistsData } = await useFetch('/api/artists')
const artists = computed(() => artistsData.value || [])
const totalCount = computed(() => artists.value.length)

const filteredArtists = computed(() => {
  let result = [...artists.value]

  if (filters.value.status.length > 0) {
    result = result.filter(a => filters.value.status.includes(a.status))
  }

  if (filters.value.priceRange) {
    const [min, max] = filters.value.priceRange.split('-').map(Number)
    result = result.filter(a => {
      if (max) {
        return a.base_price >= min && a.base_price <= max
      }
      return a.base_price >= min
    })
  }

  if (filters.value.styleTags.length > 0) {
    result = result.filter(a =>
        a.tags?.some(tag => filters.value.styleTags.includes(tag))
    )
  }

  result.sort((a, b) => {
    switch (currentSort.value) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'price_low':
        return a.base_price - b.base_price
      case 'price_high':
        return b.base_price - a.base_price
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return (b.total_sales || 0) - (a.total_sales || 0)
    }
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredArtists.value.length / pageSize))

const paginatedArtists = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredArtists.value.slice(start, start + pageSize)
})

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxDisplay / 2))
  let end = Math.min(totalPages.value, start + maxDisplay - 1)

  if (end - start < maxDisplay - 1) {
    start = Math.max(1, end - maxDisplay + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const toggleStyleTag = (tag: string) => {
  const index = filters.value.styleTags.indexOf(tag)
  if (index > -1) {
    filters.value.styleTags.splice(index, 1)
  } else {
    filters.value.styleTags.push(tag)
  }
}

const resetFilters = () => {
  filters.value = {
    status: [],
    priceRange: '',
    styleTags: [],
  }
  currentSort.value = 'popular'
  currentPage.value = 1
}

watch([filters, currentSort], () => {
  currentPage.value = 1
}, { deep: true })
</script>