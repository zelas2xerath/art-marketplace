<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold text-xl">画</span>
          </div>
          <span class="text-xl font-bold text-gray-900">画社市场</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink to="/artists" class="text-gray-700 hover:text-purple-600 font-medium transition-colors">
            浏览画师
          </NuxtLink>
          <NuxtLink to="/artworks" class="text-gray-700 hover:text-purple-600 font-medium transition-colors">
            作品展示
          </NuxtLink>
          <NuxtLink to="/orders/create" class="text-gray-700 hover:text-purple-600 font-medium transition-colors">
            定制服务
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-4">
          <button @click="toggleSearch" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <NuxtLink v-if="!isLoggedIn" to="/login" class="text-gray-700 hover:text-purple-600 font-medium transition-colors">
            登录
          </NuxtLink>

          <template v-else>
            <NuxtLink to="/messages" class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ unreadCount }}
              </span>
            </NuxtLink>

            <NuxtLink to="/cart" class="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ cartCount }}
              </span>
            </NuxtLink>

            <div class="relative">
              <button @click="toggleUserMenu" class="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <img :src="userAvatar" class="w-8 h-8 rounded-full" />
              </button>

              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                <NuxtLink to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  个人中心
                </NuxtLink>
                <NuxtLink to="/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  我的订单
                </NuxtLink>
                <NuxtLink v-if="isArtist" to="/artist/dashboard" class="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                  画师工作台
                </NuxtLink>
                <hr class="my-2">
                <button @click="logout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                  退出登录
                </button>
              </div>
            </div>
          </template>

          <button @click="toggleMobileMenu" class="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="showMobileMenu" class="md:hidden border-t bg-white">
      <nav class="container mx-auto px-4 py-4 space-y-2">
        <NuxtLink to="/artists" class="block py-2 text-gray-700 hover:text-purple-600">
          浏览画师
        </NuxtLink>
        <NuxtLink to="/artworks" class="block py-2 text-gray-700 hover:text-purple-600">
          作品展示
        </NuxtLink>
        <NuxtLink to="/orders/create" class="block py-2 text-gray-700 hover:text-purple-600">
          定制服务
        </NuxtLink>
      </nav>
    </div>

    <!-- Search Modal -->
    <div v-if="showSearch" @click="toggleSearch" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div @click.stop class="bg-white rounded-lg w-full max-w-2xl mx-4 p-6">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索画师、作品..."
            class="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-lg focus:border-purple-600 focus:outline-none"
            autofocus
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const isLoggedIn = ref(false)
const isArtist = ref(false)
const userAvatar = ref('/default-avatar.jpg')
const unreadCount = ref(0)
const cartCount = ref(0)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

const logout = () => {
  // Implement logout logic
  isLoggedIn.value = false
  showUserMenu.value = false
}

// Close menus when clicking outside
onMounted(() => {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.relative')) {
      showUserMenu.value = false
    }
  })
})
</script>