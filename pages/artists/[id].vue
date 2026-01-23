<!-- frontend/pages/artists/[id].vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Artist Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-8">
        <div class="flex items-start gap-6">
          <img :src="artist.avatar_url" class="w-32 h-32 rounded-full" />
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold">{{ artist.display_name }}</h1>
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {{ statusText }}
              </span>
            </div>
            <p class="text-gray-600 mb-4">{{ artist.bio }}</p>
            <div class="flex gap-4 text-sm text-gray-500">
              <span>⭐ {{ artist.rating }} 评分</span>
              <span>📦 {{ artist.total_sales }} 订单</span>
              <span>👁 {{ artist.view_count }} 浏览</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-purple-600 mb-2">
              ¥{{ artist.base_price }}起
            </div>
            <button @click="openChat" class="bg-purple-600 text-white px-6 py-2 rounded-lg mb-2">
              联系画师
            </button>
            <button @click="viewServices" class="border border-purple-600 text-purple-600 px-6 py-2 rounded-lg">
              查看服务
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Artist Works -->
    <div class="container mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">作品集</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ArtworkCard
            v-for="work in artworks"
            :key="work.id"
            :artwork="work"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: artist } = await useFetch(`/api/artists/${route.params.id}`)
const { data: artworks } = await useFetch(`/api/artists/${route.params.id}/artworks`)

const statusText = computed(() => {
  const map = { ready: '接单中', busy: '忙碌', offline: '休息中' }
  return map[artist.value?.status] || '未知'
})

const openChat = () => {
  navigateTo(`/chat/${artist.value.customer_id}`)
}
</script>