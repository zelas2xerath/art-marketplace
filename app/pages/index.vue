<!-- frontend/pages/index.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
      <div class="container mx-auto px-4">
        <h1 class="text-5xl font-bold mb-4">找到你的专属画师</h1>
        <p class="text-xl mb-8">连接创意与需求，定制独一无二的艺术作品</p>
        <div class="flex gap-4">
          <NuxtLink to="/artists" class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
            浏览画师
          </NuxtLink>
          <NuxtLink to="/artworks" class="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
            作品展示
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Artists -->
    <section class="container mx-auto px-4 py-16">
      <h2 class="text-3xl font-bold mb-8">人气画师</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ArtistCard
            v-for="artist in featuredArtists"
            :key="artist.id"
            :artist="artist"
        />
      </div>
    </section>

    <!-- Hot Artworks -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8">热门作品</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ArtworkCard
              v-for="artwork in hotArtworks"
              :key="artwork.id"
              :artwork="artwork"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: featuredArtists } = await useFetch('/api/artists/featured')
const { data: hotArtworks } = await useFetch('/api/artworks/hot')
</script>