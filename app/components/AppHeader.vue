<template>
  <header class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="page-container">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <span class="text-white font-bold text-xl lg:text-2xl">画</span>
          </div>
          <span class="text-xl lg:text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            画社市场
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="group relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
          >
            <span class="flex items-center gap-2">
              <Icon :name="link.icon" class="w-5 h-5" />
              {{ link.label }}
            </span>
            <span class="absolute bottom-0 left-4 right-4 h-0.5 bg-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2 lg:gap-3">
          <!-- Search Button -->
          <button
              @click="toggleSearch"
              class="p-2 lg:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
              aria-label="搜索"
          >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
          </button>

          <!-- Guest Actions -->
          <template v-if="!isLoggedIn">
            <NuxtLink
                to="/login"
                class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              <span>登录</span>
            </NuxtLink>
            <NuxtLink
                to="/register"
                class="hidden sm:inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-purple-700 shadow-sm hover:shadow-md transition-all"
            >
              <Icon name="heroicons:user-plus" class="w-5 h-5" />
              <span>注册</span>
            </NuxtLink>
          </template>

          <!-- Authenticated Actions -->
          <template v-else>
            <!-- Messages -->
            <NuxtLink
                to="/messages"
                class="relative p-2 lg:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="消息"
            >
              <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
              <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </NuxtLink>

            <!-- Cart -->
            <NuxtLink
                to="/cart"
                class="relative p-2 lg:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group"
                aria-label="购物车"
            >
              <Icon name="heroicons:shopping-cart" class="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
              <span
                  v-if="cartCount > 0"
                  class="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md"
              >
                {{ cartCount > 9 ? '9+' : cartCount }}
              </span>
            </NuxtLink>

            <!-- User Menu -->
            <div class="relative" v-click-outside="closeUserMenu">
              <button
                  @click="toggleUserMenu"
                  class="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="用户菜单"
              >
                <img
                    :src="userAvatar"
                    class="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover ring-2 ring-purple-100"
                    alt="用户头像"
                />
                <Icon
                    name="heroicons:chevron-down"
                    class="hidden lg:block w-4 h-4 text-gray-600 transition-transform"
                    :class="{ 'rotate-180': showUserMenu }"
                />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
              >
                <div
                    v-if="showUserMenu"
                    class="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                >
                  <!-- User Info -->
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="font-semibold text-gray-900">{{ userName }}</div>
                    <div class="text-sm text-gray-500">{{ userEmail }}</div>
                  </div>

                  <!-- Menu Items -->
                  <div class="py-2">
                    <NuxtLink
                        v-for="item in userMenuItems"
                        :key="item.to"
                        :to="item.to"
                        class="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        @click="closeUserMenu"
                    >
                      <Icon :name="item.icon" class="w-5 h-5" />
                      <span>{{ item.label }}</span>
                    </NuxtLink>
                  </div>

                  <!-- Logout -->
                  <div class="border-t border-gray-100 pt-2">
                    <button
                        @click="handleLogout"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <!-- Mobile Menu Toggle -->
          <button
              @click="toggleMobileMenu"
              class="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="菜单"
          >
            <Icon
                :name="showMobileMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
                class="w-6 h-6 text-gray-600"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="showMobileMenu" class="lg:hidden border-t border-gray-100 bg-white">
        <nav class="page-container py-4 space-y-1">
          <NuxtLink
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg font-medium transition-colors"
              @click="closeMobileMenu"
          >
            <Icon :name="link.icon" class="w-5 h-5" />
            <span>{{ link.label }}</span>
          </NuxtLink>

          <template v-if="!isLoggedIn">
            <NuxtLink
                to="/login"
                class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg font-medium transition-colors"
                @click="closeMobileMenu"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              <span>登录</span>
            </NuxtLink>
            <NuxtLink
                to="/register"
                class="flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold"
                @click="closeMobileMenu"
            >
              <Icon name="heroicons:user-plus" class="w-5 h-5" />
              <span>注册</span>
            </NuxtLink>
          </template>
        </nav>
      </div>
    </Transition>

    <!-- Search Modal -->
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div
          v-if="showSearch"
          @click="closeSearch"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      >
        <div
            @click.stop
            class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
        >
          <div class="p-6">
            <div class="flex items-center gap-4 mb-4">
              <Icon name="heroicons:magnifying-glass" class="w-6 h-6 text-gray-400" />
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索画师、作品、标签..."
                  class="flex-1 text-lg outline-none"
                  autofocus
                  @keyup.enter="performSearch"
              />
              <button @click="closeSearch" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Icon name="heroicons:x-mark" class="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <!-- Search Suggestions -->
            <div v-if="searchQuery.length === 0" class="space-y-4">
              <div>
                <div class="text-sm font-semibold text-gray-500 mb-2">热门搜索</div>
                <div class="flex flex-wrap gap-2">
                  <button
                      v-for="tag in hotSearches"
                      :key="tag"
                      @click="searchQuery = tag"
                      class="px-3 py-1.5 bg-gray-100 hover:bg-purple-100 hover:text-purple-600 rounded-full text-sm transition-colors"
                  >
                    {{ tag }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const isLoggedIn = ref(false)
const isArtist = ref(false)
const userName = ref('用户名')
const userEmail = ref('user@example.com')
const userAvatar = ref('/default-avatar.jpg')
const unreadCount = ref(3)
const cartCount = ref(2)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

const navLinks = [
  { to: '/artists', label: '浏览画师', icon: 'heroicons:user-group' },
  { to: '/artworks', label: '作品展示', icon: 'heroicons:photo' },
  { to: '/orders/create', label: '定制服务', icon: 'heroicons:sparkles' },
  { to: '/help', label: '帮助中心', icon: 'heroicons:question-mark-circle' },
]

const userMenuItems = computed(() => {
  const items = [
    { to: '/profile', label: '个人中心', icon: 'heroicons:user-circle' },
    { to: '/orders', label: '我的订单', icon: 'heroicons:shopping-bag' },
    { to: '/favorites', label: '我的收藏', icon: 'heroicons:heart' },
    { to: '/settings', label: '账户设置', icon: 'heroicons:cog-6-tooth' },
  ]

  if (isArtist.value) {
    items.splice(2, 0, { to: '/artist/dashboard', label: '画师工作台', icon: 'heroicons:chart-bar' })
  }

  return items
})

const hotSearches = ['日系插画', '角色立绘', 'Q版头像', '场景设计', '表情包定制']

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const toggleSearch = () => {
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    closeSearch()
  }
}

const handleLogout = () => {
  isLoggedIn.value = false
  closeUserMenu()
  navigateTo('/')
}

const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    // 定义点击事件处理函数
    const clickHandler = (event: Event) => {
      // 检查点击是否发生在元素外部
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(); // 执行绑定的函数
      }
    };

    // 将处理函数附加到元素（使用类型断言）
    (el as any)._clickOutsideHandler = clickHandler;
    document.addEventListener('click', clickHandler);
  },
  unmounted(el: HTMLElement) {
    // 获取并移除事件监听（使用类型断言）
    const handler = (el as any)._clickOutsideHandler as (e: Event) => void;
    document.removeEventListener('click', handler);
  }
};

</script>