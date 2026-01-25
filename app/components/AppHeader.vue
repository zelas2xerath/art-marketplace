<template>
  <header class="app-header" :class="headerClasses">
    <div class="app-header-container">
      <div class="app-header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="app-logo" :class="logoClasses">
          <div class="app-logo-icon" :class="logoIconClasses">
            <span class="app-logo-text">画</span>
          </div>
          <span class="app-logo-title" :class="logoTitleClasses">
            画社市场
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="app-nav-desktop" :class="navDesktopClasses">
          <NuxtLink
              v-for="link in visibleNavLinks"
              :key="link.to"
              :to="link.to"
              class="app-nav-link"
              :class="getNavLinkClasses(link)"
              :aria-current="isCurrentPage(link.to) ? 'page' : undefined"
          >
            <span class="app-nav-link-content">
              <Icon :name="link.icon" class="app-nav-link-icon" />
              {{ link.label }}
            </span>
            <span class="app-nav-link-indicator" :class="getNavIndicatorClasses(link)"></span>
          </NuxtLink>
        </nav>

        <!-- Actions -->
        <div class="app-header-actions" :class="actionsClasses">
          <!-- Search Button -->
          <button
              @click="toggleSearch"
              class="app-action-btn app-search-btn"
              :class="searchButtonClasses"
              aria-label="搜索"
          >
            <Icon name="heroicons:magnifying-glass" class="app-action-icon" />
          </button>

          <!-- Notifications (Authenticated users only) -->
          <button
              v-if="isLoggedIn"
              @click="toggleNotifications"
              class="app-action-btn app-notification-btn"
              :class="notificationButtonClasses"
              aria-label="通知"
          >
            <Icon name="heroicons:bell" class="app-action-icon" />
            <span
                v-if="notificationCount > 0"
                class="app-badge app-notification-badge"
                :class="notificationBadgeClasses"
            >
              {{ notificationCount > 99 ? '99+' : notificationCount }}
            </span>
          </button>

          <!-- Guest Actions -->
          <template v-if="!isLoggedIn">
            <NuxtLink
                to="/login"
                class="app-auth-btn app-login-btn"
                :class="loginButtonClasses"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="app-auth-btn-icon" />
              <span class="app-auth-btn-text">登录</span>
            </NuxtLink>
            <NuxtLink
                to="/register"
                class="app-auth-btn app-register-btn"
                :class="registerButtonClasses"
            >
              <Icon name="heroicons:user-plus" class="app-auth-btn-icon" />
              <span class="app-auth-btn-text">注册</span>
            </NuxtLink>
          </template>

          <!-- Authenticated Actions -->
          <template v-else>
            <!-- Messages -->
            <NuxtLink
                to="/messages"
                class="app-action-btn app-message-btn"
                :class="messageButtonClasses"
                aria-label="消息"
            >
              <Icon name="heroicons:chat-bubble-left-right" class="app-action-icon" />
              <span
                  v-if="unreadCount > 0"
                  class="app-badge app-message-badge"
                  :class="messageBadgeClasses"
              >
                {{ unreadCount > 99 ? '99+' : unreadCount }}
              </span>
            </NuxtLink>

            <!-- Cart (Client role only) -->
            <NuxtLink
                v-if="userRole === 'client'"
                to="/cart"
                class="app-action-btn app-cart-btn"
                :class="cartButtonClasses"
                aria-label="购物车"
            >
              <Icon name="heroicons:shopping-cart" class="app-action-icon" />
              <span
                  v-if="cartCount > 0"
                  class="app-badge app-cart-badge"
                  :class="cartBadgeClasses"
              >
                {{ cartCount > 99 ? '99+' : cartCount }}
              </span>
            </NuxtLink>

            <!-- Quick Actions (Role-specific) -->
            <div v-if="quickActions.length > 0" class="app-quick-actions" :class="quickActionsClasses">
              <button
                  v-for="action in quickActions"
                  :key="action.key"
                  @click="handleQuickAction(action)"
                  class="app-quick-action-btn"
                  :class="getQuickActionClasses(action)"
                  :aria-label="action.label"
                  :title="action.label"
              >
                <Icon :name="action.icon" class="app-quick-action-icon" />
              </button>
            </div>

            <!-- User Menu -->
            <div class="app-user-menu" :class="userMenuClasses" v-click-outside="closeUserMenu">
              <button
                  @click="toggleUserMenu"
                  class="app-user-menu-trigger"
                  :class="userMenuTriggerClasses"
                  aria-label="用户菜单"
                  :aria-expanded="showUserMenu"
              >
                <img
                    :src="userAvatar"
                    class="app-user-avatar"
                    :class="userAvatarClasses"
                    alt="用户头像"
                />
                <div class="app-user-info" :class="userInfoClasses">
                  <span class="app-user-name">{{ userName }}</span>
                  <span class="app-user-role">{{ getRoleDisplayName(userRole) }}</span>
                </div>
                <Icon
                    name="heroicons:chevron-down"
                    class="app-user-menu-chevron"
                    :class="getUserMenuChevronClasses()"
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
                    class="app-user-dropdown"
                    :class="userDropdownClasses"
                >
                  <!-- User Info -->
                  <div class="app-user-dropdown-header" :class="userDropdownHeaderClasses">
                    <div class="app-user-dropdown-name">{{ userName }}</div>
                    <div class="app-user-dropdown-email">{{ userEmail }}</div>
                    <div class="app-user-dropdown-role" :class="getUserRoleBadgeClasses()">
                      {{ getRoleDisplayName(userRole) }}
                    </div>
                  </div>

                  <!-- Menu Items -->
                  <div class="app-user-dropdown-menu" :class="userDropdownMenuClasses">
                    <NuxtLink
                        v-for="item in visibleUserMenuItems"
                        :key="item.to"
                        :to="item.to"
                        class="app-user-dropdown-item"
                        :class="getUserDropdownItemClasses(item)"
                        @click="closeUserMenu"
                    >
                      <Icon :name="item.icon" class="app-user-dropdown-item-icon" />
                      <span class="app-user-dropdown-item-text">{{ item.label }}</span>
                      <Icon
                          v-if="item.badge"
                          name="heroicons:exclamation-circle"
                          class="app-user-dropdown-item-badge"
                      />
                    </NuxtLink>
                  </div>

                  <!-- Role Switch (Admin only) -->
                  <div
                      v-if="userRole === 'admin' && availableRoles.length > 1"
                      class="app-role-switch"
                      :class="roleSwitchClasses"
                  >
                    <div class="app-role-switch-label">切换角色</div>
                    <div class="app-role-switch-options">
                      <button
                          v-for="role in availableRoles"
                          :key="role"
                          @click="switchRole(role)"
                          class="app-role-switch-btn"
                          :class="getRoleSwitchButtonClasses(role)"
                      >
                        {{ getRoleDisplayName(role) }}
                      </button>
                    </div>
                  </div>

                  <!-- Logout -->
                  <div class="app-user-dropdown-footer" :class="userDropdownFooterClasses">
                    <button
                        @click="handleLogout"
                        class="app-logout-btn"
                        :class="logoutButtonClasses"
                    >
                      <Icon name="heroicons:arrow-right-on-rectangle" class="app-logout-btn-icon" />
                      <span class="app-logout-btn-text">退出登录</span>
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </template>

          <!-- Mobile Menu Toggle -->
          <button
              @click="toggleMobileMenu"
              class="app-mobile-menu-toggle"
              :class="mobileMenuToggleClasses"
              aria-label="菜单"
              :aria-expanded="showMobileMenu"
          >
            <Icon
                :name="showMobileMenu ? 'heroicons:x-mark' : 'heroicons:bars-3'"
                class="app-mobile-menu-icon"
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
      <div v-if="showMobileMenu" class="app-mobile-menu" :class="mobileMenuClasses">
        <nav class="app-mobile-nav" :class="mobileNavClasses">
          <NuxtLink
              v-for="link in visibleNavLinks"
              :key="link.to"
              :to="link.to"
              class="app-mobile-nav-link"
              :class="getMobileNavLinkClasses(link)"
              @click="closeMobileMenu"
          >
            <Icon :name="link.icon" class="app-mobile-nav-link-icon" />
            <span class="app-mobile-nav-link-text">{{ link.label }}</span>
            <Icon
                v-if="link.badge"
                name="heroicons:exclamation-circle"
                class="app-mobile-nav-link-badge"
            />
          </NuxtLink>

          <!-- Mobile Auth Actions -->
          <template v-if="!isLoggedIn">
            <NuxtLink
                to="/login"
                class="app-mobile-nav-link app-mobile-auth-link"
                :class="mobileLoginLinkClasses"
                @click="closeMobileMenu"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="app-mobile-nav-link-icon" />
              <span class="app-mobile-nav-link-text">登录</span>
            </NuxtLink>
            <NuxtLink
                to="/register"
                class="app-mobile-nav-link app-mobile-auth-link app-mobile-register-link"
                :class="mobileRegisterLinkClasses"
                @click="closeMobileMenu"
            >
              <Icon name="heroicons:user-plus" class="app-mobile-nav-link-icon" />
              <span class="app-mobile-nav-link-text">注册</span>
            </NuxtLink>
          </template>

          <!-- Mobile User Menu Items -->
          <template v-else>
            <div class="app-mobile-user-section" :class="mobileUserSectionClasses">
              <div class="app-mobile-user-info" :class="mobileUserInfoClasses">
                <img
                    :src="userAvatar"
                    class="app-mobile-user-avatar"
                    :class="mobileUserAvatarClasses"
                    alt="用户头像"
                />
                <div class="app-mobile-user-details">
                  <div class="app-mobile-user-name">{{ userName }}</div>
                  <div class="app-mobile-user-role" :class="getMobileUserRoleClasses()">
                    {{ getRoleDisplayName(userRole) }}
                  </div>
                </div>
              </div>

              <div class="app-mobile-user-menu" :class="mobileUserMenuClasses">
                <NuxtLink
                    v-for="item in visibleUserMenuItems"
                    :key="item.to"
                    :to="item.to"
                    class="app-mobile-nav-link"
                    :class="getMobileUserMenuItemClasses(item)"
                    @click="closeMobileMenu"
                >
                  <Icon :name="item.icon" class="app-mobile-nav-link-icon" />
                  <span class="app-mobile-nav-link-text">{{ item.label }}</span>
                  <Icon
                      v-if="item.badge"
                      name="heroicons:exclamation-circle"
                      class="app-mobile-nav-link-badge"
                  />
                </NuxtLink>
              </div>
            </div>
          </template>
        </nav>
      </div>
    </Transition>

    <!-- Notifications Panel -->
    <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-x-full"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-full"
    >
      <div
          v-if="showNotifications"
          @click="closeNotifications"
          class="app-notifications-overlay"
          :class="notificationsOverlayClasses"
      >
        <div
            @click.stop
            class="app-notifications-panel"
            :class="notificationsPanelClasses"
        >
          <div class="app-notifications-header" :class="notificationsHeaderClasses">
            <h3 class="app-notifications-title">通知</h3>
            <div class="app-notifications-actions">
              <button
                  v-if="notifications.length > 0"
                  @click="markAllAsRead"
                  class="app-notifications-action-btn"
                  :class="notificationsActionBtnClasses"
              >
                全部已读
              </button>
              <button
                  @click="closeNotifications"
                  class="app-notifications-close-btn"
                  :class="notificationsCloseBtnClasses"
              >
                <Icon name="heroicons:x-mark" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="app-notifications-content" :class="notificationsContentClasses">
            <div v-if="notifications.length === 0" class="app-notifications-empty">
              <Icon name="heroicons:bell-slash" class="app-notifications-empty-icon" />
              <p class="app-notifications-empty-text">暂无通知</p>
            </div>

            <div v-else class="app-notifications-list">
              <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="app-notification-item"
                  :class="getNotificationItemClasses(notification)"
                  @click="handleNotificationClick(notification)"
              >
                <div class="app-notification-icon" :class="getNotificationIconClasses(notification)">
                  <Icon :name="getNotificationIcon(notification.type)" class="w-5 h-5" />
                </div>
                <div class="app-notification-content">
                  <div class="app-notification-title">{{ notification.title }}</div>
                  <div class="app-notification-message">{{ notification.message }}</div>
                  <div class="app-notification-time">{{ formatNotificationTime(notification.createdAt) }}</div>
                </div>
                <div v-if="!notification.isRead" class="app-notification-unread-indicator"></div>
              </div>
            </div>
          </div>
        </div>
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
import { computed, ref, watch } from 'vue'
import type { ComponentSize } from '~/types/design-tokens'

export interface AppHeaderProps {
  userRole?: 'guest' | 'client' | 'artist' | 'admin'
  user?: {
    id: string
    name: string
    email: string
    avatar: string
    unreadMessages: number
    cartItemCount: number
    notificationCount: number
  }
  currentPath?: string
  size?: ComponentSize
  variant?: 'default' | 'compact' | 'minimal'
  showSearch?: boolean
  showNotifications?: boolean
  onSearch?: (query: string) => void
  onNotificationClick?: (notificationId: string) => void
  onProfileClick?: () => void
  onCartClick?: () => void
}

const props = withDefaults(defineProps<AppHeaderProps>(), {
  userRole: 'guest',
  size: 'md',
  variant: 'default',
  showSearch: true,
  showNotifications: true,
})

const emit = defineEmits<{
  search: [query: string]
  notificationClick: [notificationId: string]
  profileClick: []
  cartClick: []
  roleSwitch: [role: string]
  logout: []
}>()

// Reactive state
const isLoggedIn = computed(() => props.userRole !== 'guest')
const userRole = computed(() => props.userRole)
const userName = computed(() => props.user?.name || '用户名')
const userEmail = computed(() => props.user?.email || 'user@example.com')
const userAvatar = computed(() => props.user?.avatar || '/placeholder-avatar.jpg')
const unreadCount = computed(() => props.user?.unreadMessages || 0)
const cartCount = computed(() => props.user?.cartItemCount || 0)
const notificationCount = computed(() => props.user?.notificationCount || 0)

// UI state
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const showSearch = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')

// Mock data - in real app, this would come from props or composables
const notifications = ref([
  {
    id: '1',
    type: 'order',
    title: '订单更新',
    message: '您的订单 #12345 已开始制作',
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    isRead: false,
    actionUrl: '/orders/12345'
  },
  {
    id: '2',
    type: 'message',
    title: '新消息',
    message: '画师小明回复了您的咨询',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: false,
    actionUrl: '/messages/artist-123'
  },
  {
    id: '3',
    type: 'system',
    title: '系统通知',
    message: '您的账户安全设置已更新',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    isRead: true,
    actionUrl: '/settings/security'
  }
])

// Navigation configuration based on role
const baseNavLinks = [
  { to: '/artists', label: '浏览画师', icon: 'heroicons:user-group', roles: ['guest', 'client', 'artist', 'admin'], badge: false },
  { to: '/artworks', label: '作品展示', icon: 'heroicons:photo', roles: ['guest', 'client', 'artist', 'admin'], badge: false },
  { to: '/orders/create', label: '定制服务', icon: 'heroicons:sparkles', roles: ['client'], badge: false },
  { to: '/help', label: '帮助中心', icon: 'heroicons:question-mark-circle', roles: ['guest', 'client', 'artist', 'admin'], badge: false },
]

const roleSpecificNavLinks = {
  artist: [
    { to: '/artist/dashboard', label: '工作台', icon: 'heroicons:chart-bar', roles: ['artist'], badge: false },
    { to: '/artist/artworks', label: '我的作品', icon: 'heroicons:photo', roles: ['artist'], badge: false },
    { to: '/artist/orders', label: '订单管理', icon: 'heroicons:shopping-bag', roles: ['artist'], badge: true },
  ],
  admin: [
    { to: '/admin/dashboard', label: '管理后台', icon: 'heroicons:cog-6-tooth', roles: ['admin'], badge: false },
    { to: '/admin/users', label: '用户管理', icon: 'heroicons:users', roles: ['admin'], badge: false },
    { to: '/admin/reports', label: '数据报表', icon: 'heroicons:chart-bar-square', roles: ['admin'], badge: false },
  ]
}

const visibleNavLinks = computed(() => {
  const currentRole = userRole.value
  let links = baseNavLinks.filter(link => link.roles.includes(currentRole))
  
  if (roleSpecificNavLinks[currentRole as keyof typeof roleSpecificNavLinks]) {
    links = [...links, ...roleSpecificNavLinks[currentRole as keyof typeof roleSpecificNavLinks]]
  }
  
  return links
})

// User menu items based on role
const baseUserMenuItems = [
  { to: '/profile', label: '个人中心', icon: 'heroicons:user-circle', roles: ['client', 'artist', 'admin'], badge: false },
  { to: '/settings', label: '账户设置', icon: 'heroicons:cog-6-tooth', roles: ['client', 'artist', 'admin'], badge: false },
]

const roleSpecificUserMenuItems = {
  client: [
    { to: '/orders', label: '我的订单', icon: 'heroicons:shopping-bag', roles: ['client'], badge: false },
    { to: '/favorites', label: '我的收藏', icon: 'heroicons:heart', roles: ['client'], badge: false },
  ],
  artist: [
    { to: '/artist/earnings', label: '收益统计', icon: 'heroicons:banknotes', roles: ['artist'], badge: false },
    { to: '/artist/analytics', label: '数据分析', icon: 'heroicons:chart-bar', roles: ['artist'], badge: false },
  ],
  admin: [
    { to: '/admin/system', label: '系统设置', icon: 'heroicons:server', roles: ['admin'], badge: false },
    { to: '/admin/logs', label: '操作日志', icon: 'heroicons:document-text', roles: ['admin'], badge: true },
  ]
}

const visibleUserMenuItems = computed(() => {
  const currentRole = userRole.value
  if (currentRole === 'guest') return []
  
  let items = baseUserMenuItems.filter(item => item.roles.includes(currentRole))
  
  if (roleSpecificUserMenuItems[currentRole as keyof typeof roleSpecificUserMenuItems]) {
    items = [...items, ...roleSpecificUserMenuItems[currentRole as keyof typeof roleSpecificUserMenuItems]]
  }
  
  return items
})

// Quick actions based on role
const quickActions = computed(() => {
  const actions = []
  
  if (userRole.value === 'artist') {
    actions.push(
      { key: 'upload', label: '上传作品', icon: 'heroicons:plus', action: () => navigateTo('/artist/artworks/create') },
      { key: 'orders', label: '待处理订单', icon: 'heroicons:bell-alert', action: () => navigateTo('/artist/orders?status=pending') }
    )
  }
  
  if (userRole.value === 'admin') {
    actions.push(
      { key: 'reports', label: '生成报表', icon: 'heroicons:document-chart-bar', action: () => navigateTo('/admin/reports/generate') },
      { key: 'users', label: '用户审核', icon: 'heroicons:user-plus', action: () => navigateTo('/admin/users?status=pending') }
    )
  }
  
  return actions
})

// Available roles for role switching (admin only)
const availableRoles = computed(() => {
  if (userRole.value === 'admin') {
    return ['admin', 'artist', 'client']
  }
  return [userRole.value]
})

const hotSearches = ['日系插画', '角色立绘', 'Q版头像', '场景设计', '表情包定制']

// Computed classes
const headerClasses = computed(() => [
  'app-header-base',
  `app-header-${props.variant}`,
  `app-header-${props.size}`,
  `app-header-role-${userRole.value}`,
])

const logoClasses = computed(() => [
  'app-logo-base',
  `app-logo-${props.size}`,
])

const logoIconClasses = computed(() => [
  'app-logo-icon-base',
  `app-logo-icon-${props.size}`,
])

const logoTitleClasses = computed(() => [
  'app-logo-title-base',
  `app-logo-title-${props.size}`,
])

const navDesktopClasses = computed(() => [
  'app-nav-desktop-base',
  `app-nav-desktop-${props.size}`,
])

const actionsClasses = computed(() => [
  'app-header-actions-base',
  `app-header-actions-${props.size}`,
])

const searchButtonClasses = computed(() => [
  'app-search-btn-base',
  `app-search-btn-${props.size}`,
])

const notificationButtonClasses = computed(() => [
  'app-notification-btn-base',
  `app-notification-btn-${props.size}`,
])

const notificationBadgeClasses = computed(() => [
  'app-notification-badge-base',
  `app-notification-badge-${props.size}`,
])

const loginButtonClasses = computed(() => [
  'app-login-btn-base',
  `app-login-btn-${props.size}`,
])

const registerButtonClasses = computed(() => [
  'app-register-btn-base',
  `app-register-btn-${props.size}`,
])

const messageButtonClasses = computed(() => [
  'app-message-btn-base',
  `app-message-btn-${props.size}`,
])

const messageBadgeClasses = computed(() => [
  'app-message-badge-base',
  `app-message-badge-${props.size}`,
])

const cartButtonClasses = computed(() => [
  'app-cart-btn-base',
  `app-cart-btn-${props.size}`,
])

const cartBadgeClasses = computed(() => [
  'app-cart-badge-base',
  `app-cart-badge-${props.size}`,
])

const quickActionsClasses = computed(() => [
  'app-quick-actions-base',
  `app-quick-actions-${props.size}`,
])

const userMenuClasses = computed(() => [
  'app-user-menu-base',
  `app-user-menu-${props.size}`,
])

const userMenuTriggerClasses = computed(() => [
  'app-user-menu-trigger-base',
  `app-user-menu-trigger-${props.size}`,
  { 'app-user-menu-trigger-active': showUserMenu.value }
])

const userAvatarClasses = computed(() => [
  'app-user-avatar-base',
  `app-user-avatar-${props.size}`,
])

const userInfoClasses = computed(() => [
  'app-user-info-base',
  `app-user-info-${props.size}`,
])

const userDropdownClasses = computed(() => [
  'app-user-dropdown-base',
  `app-user-dropdown-${props.size}`,
])

const userDropdownHeaderClasses = computed(() => [
  'app-user-dropdown-header-base',
  `app-user-dropdown-header-${props.size}`,
])

const userDropdownMenuClasses = computed(() => [
  'app-user-dropdown-menu-base',
  `app-user-dropdown-menu-${props.size}`,
])

const userDropdownFooterClasses = computed(() => [
  'app-user-dropdown-footer-base',
  `app-user-dropdown-footer-${props.size}`,
])

const roleSwitchClasses = computed(() => [
  'app-role-switch-base',
  `app-role-switch-${props.size}`,
])

const logoutButtonClasses = computed(() => [
  'app-logout-btn-base',
  `app-logout-btn-${props.size}`,
])

const mobileMenuToggleClasses = computed(() => [
  'app-mobile-menu-toggle-base',
  `app-mobile-menu-toggle-${props.size}`,
])

const mobileMenuClasses = computed(() => [
  'app-mobile-menu-base',
  `app-mobile-menu-${props.size}`,
])

const mobileNavClasses = computed(() => [
  'app-mobile-nav-base',
  `app-mobile-nav-${props.size}`,
])

const mobileLoginLinkClasses = computed(() => [
  'app-mobile-login-link-base',
  `app-mobile-login-link-${props.size}`,
])

const mobileRegisterLinkClasses = computed(() => [
  'app-mobile-register-link-base',
  `app-mobile-register-link-${props.size}`,
])

const mobileUserSectionClasses = computed(() => [
  'app-mobile-user-section-base',
  `app-mobile-user-section-${props.size}`,
])

const mobileUserInfoClasses = computed(() => [
  'app-mobile-user-info-base',
  `app-mobile-user-info-${props.size}`,
])

const mobileUserAvatarClasses = computed(() => [
  'app-mobile-user-avatar-base',
  `app-mobile-user-avatar-${props.size}`,
])

const mobileUserMenuClasses = computed(() => [
  'app-mobile-user-menu-base',
  `app-mobile-user-menu-${props.size}`,
])

const notificationsOverlayClasses = computed(() => [
  'app-notifications-overlay-base',
  `app-notifications-overlay-${props.size}`,
])

const notificationsPanelClasses = computed(() => [
  'app-notifications-panel-base',
  `app-notifications-panel-${props.size}`,
])

const notificationsHeaderClasses = computed(() => [
  'app-notifications-header-base',
  `app-notifications-header-${props.size}`,
])

const notificationsActionBtnClasses = computed(() => [
  'app-notifications-action-btn-base',
  `app-notifications-action-btn-${props.size}`,
])

const notificationsCloseBtnClasses = computed(() => [
  'app-notifications-close-btn-base',
  `app-notifications-close-btn-${props.size}`,
])

const notificationsContentClasses = computed(() => [
  'app-notifications-content-base',
  `app-notifications-content-${props.size}`,
])

// Dynamic class methods
const getNavLinkClasses = (link: any) => [
  'app-nav-link-base',
  `app-nav-link-${props.size}`,
  { 'app-nav-link-active': isCurrentPage(link.to) }
]

const getNavIndicatorClasses = (link: any) => [
  'app-nav-link-indicator-base',
  { 'app-nav-link-indicator-active': isCurrentPage(link.to) }
]

const getQuickActionClasses = (action: any) => [
  'app-quick-action-btn-base',
  `app-quick-action-btn-${props.size}`,
  `app-quick-action-btn-${action.key}`,
]

const getUserMenuChevronClasses = () => [
  'app-user-menu-chevron-base',
  `app-user-menu-chevron-${props.size}`,
  { 'app-user-menu-chevron-rotated': showUserMenu.value }
]

const getUserRoleBadgeClasses = () => [
  'app-user-role-badge-base',
  `app-user-role-badge-${userRole.value}`,
  `app-user-role-badge-${props.size}`,
]

const getUserDropdownItemClasses = (item: any) => [
  'app-user-dropdown-item-base',
  `app-user-dropdown-item-${props.size}`,
  { 'app-user-dropdown-item-active': isCurrentPage(item.to) }
]

const getRoleSwitchButtonClasses = (role: string) => [
  'app-role-switch-btn-base',
  `app-role-switch-btn-${props.size}`,
  { 'app-role-switch-btn-active': role === userRole.value }
]

const getMobileNavLinkClasses = (link: any) => [
  'app-mobile-nav-link-base',
  `app-mobile-nav-link-${props.size}`,
  { 'app-mobile-nav-link-active': isCurrentPage(link.to) }
]

const getMobileUserRoleClasses = () => [
  'app-mobile-user-role-base',
  `app-mobile-user-role-${userRole.value}`,
  `app-mobile-user-role-${props.size}`,
]

const getMobileUserMenuItemClasses = (item: any) => [
  'app-mobile-user-menu-item-base',
  `app-mobile-user-menu-item-${props.size}`,
  { 'app-mobile-user-menu-item-active': isCurrentPage(item.to) }
]

const getNotificationItemClasses = (notification: any) => [
  'app-notification-item-base',
  `app-notification-item-${props.size}`,
  `app-notification-item-${notification.type}`,
  { 'app-notification-item-unread': !notification.isRead }
]

const getNotificationIconClasses = (notification: any) => [
  'app-notification-icon-base',
  `app-notification-icon-${notification.type}`,
  `app-notification-icon-${props.size}`,
]

// Event handlers
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
  if (!props.showSearch) return
  showSearch.value = !showSearch.value
  if (!showSearch.value) {
    searchQuery.value = ''
  }
}

const closeSearch = () => {
  showSearch.value = false
  searchQuery.value = ''
}

const toggleNotifications = () => {
  if (!props.showNotifications) return
  showNotifications.value = !showNotifications.value
}

const closeNotifications = () => {
  showNotifications.value = false
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    if (props.onSearch) {
      props.onSearch(searchQuery.value)
    }
    emit('search', searchQuery.value)
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    closeSearch()
  }
}

const handleQuickAction = (action: any) => {
  action.action()
}

const handleNotificationClick = (notification: any) => {
  if (!notification.isRead) {
    notification.isRead = true
  }
  
  if (props.onNotificationClick) {
    props.onNotificationClick(notification.id)
  }
  emit('notificationClick', notification.id)
  
  if (notification.actionUrl) {
    navigateTo(notification.actionUrl)
  }
  
  closeNotifications()
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.isRead = true
  })
}

const switchRole = (role: string) => {
  emit('roleSwitch', role)
  closeUserMenu()
}

const handleLogout = () => {
  emit('logout')
  closeUserMenu()
  navigateTo('/')
}

// Utility functions
const isCurrentPage = (path: string): boolean => {
  if (!props.currentPath) {
    return false
  }
  return props.currentPath === path || props.currentPath.startsWith(path + '/')
}

const getRoleDisplayName = (role: string): string => {
  const roleNames = {
    guest: '访客',
    client: '客户',
    artist: '画师',
    admin: '管理员'
  }
  return roleNames[role as keyof typeof roleNames] || role
}

const getNotificationIcon = (type: string): string => {
  const iconMap = {
    order: 'heroicons:shopping-bag',
    message: 'heroicons:chat-bubble-left-ellipsis',
    system: 'heroicons:cog-6-tooth',
    payment: 'heroicons:credit-card',
    review: 'heroicons:star'
  }
  return iconMap[type as keyof typeof iconMap] || 'heroicons:bell'
}

const formatNotificationTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN')
}

// Click outside directive
const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    const clickHandler = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    ;(el as any)._clickOutsideHandler = clickHandler
    document.addEventListener('click', clickHandler)
  },
  unmounted(el: HTMLElement) {
    const handler = (el as any)._clickOutsideHandler as (e: Event) => void
    document.removeEventListener('click', handler)
  }
}

// Watch for route changes to close menus
watch(() => props.currentPath, () => {
  closeUserMenu()
  closeMobileMenu()
  closeSearch()
  closeNotifications()
})
</script>

<style scoped>
/* Base Header Styles */
.app-header-base {
  @apply bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100;
}

.app-header-compact {
  @apply shadow-none border-b-0;
}

.app-header-minimal {
  @apply bg-transparent shadow-none border-b-0;
}

.app-header-role-client {
  @apply border-b-blue-100;
}

.app-header-role-artist {
  @apply border-b-purple-100;
}

.app-header-role-admin {
  @apply border-b-red-100;
}

.app-header-container {
  @apply page-container;
}

.app-header-content {
  @apply flex items-center justify-between;
}

.app-header-content {
  @apply h-16;
}

.app-header-md .app-header-content {
  @apply lg:h-20;
}

.app-header-lg .app-header-content {
  @apply h-20 lg:h-24;
}

/* Logo Styles */
.app-logo-base {
  @apply flex items-center gap-3 group;
}

.app-logo-icon-base {
  @apply bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center
         shadow-md group-hover:shadow-lg transition-shadow;
}

.app-logo-icon-sm {
  @apply w-8 h-8;
}

.app-logo-icon-md {
  @apply w-10 h-10 lg:w-12 lg:h-12;
}

.app-logo-icon-lg {
  @apply w-12 h-12 lg:w-14 lg:h-14;
}

.app-logo-text {
  @apply text-white font-bold text-xl lg:text-2xl;
}

.app-logo-title-base {
  @apply font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent;
}

.app-logo-title-sm {
  @apply text-lg lg:text-xl;
}

.app-logo-title-md {
  @apply text-xl lg:text-2xl;
}

.app-logo-title-lg {
  @apply text-2xl lg:text-3xl;
}

/* Desktop Navigation */
.app-nav-desktop-base {
  @apply hidden lg:flex items-center gap-1;
}

.app-nav-desktop-lg {
  @apply gap-2;
}

.app-nav-link-base {
  @apply group relative px-4 py-2 text-gray-700 font-medium rounded-lg 
         hover:bg-purple-50 hover:text-purple-600 transition-all duration-200;
}

.app-nav-link-sm {
  @apply px-3 py-1.5 text-sm;
}

.app-nav-link-lg {
  @apply px-5 py-3 text-lg;
}

.app-nav-link-active {
  @apply bg-purple-50 text-purple-600;
}

.app-nav-link-content {
  @apply flex items-center gap-2;
}

.app-nav-link-icon {
  @apply w-5 h-5;
}

.app-nav-link-indicator-base {
  @apply absolute bottom-0 left-4 right-4 h-0.5 bg-purple-600 scale-x-0 
         group-hover:scale-x-100 transition-transform origin-left;
}

.app-nav-link-indicator-active {
  @apply scale-x-100;
}

/* Header Actions */
.app-header-actions-base {
  @apply flex items-center gap-2;
}

.app-header-actions-md {
  @apply lg:gap-3;
}

.app-header-actions-lg {
  @apply gap-3 lg:gap-4;
}

/* Action Buttons */
.app-action-btn {
  @apply relative p-2 hover:bg-gray-100 rounded-lg transition-colors group;
}

.app-action-btn-md {
  @apply lg:p-2.5;
}

.app-action-btn-lg {
  @apply p-3;
}

.app-action-icon {
  @apply w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors;
}

.app-action-btn-md .app-action-icon {
  @apply lg:w-6 lg:h-6;
}

.app-action-btn-lg .app-action-icon {
  @apply w-6 h-6;
}

/* Badges */
.app-badge {
  @apply absolute -top-1 -right-1 text-white text-xs font-bold rounded-full 
         w-5 h-5 flex items-center justify-center shadow-md;
}

.app-notification-badge-base {
  @apply bg-red-500;
}

.app-message-badge-base {
  @apply bg-red-500;
}

.app-cart-badge-base {
  @apply bg-purple-600;
}

/* Auth Buttons */
.app-auth-btn {
  @apply hidden sm:inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all;
}

.app-auth-btn-sm {
  @apply px-3 py-1.5 text-sm;
}

.app-auth-btn-lg {
  @apply px-5 py-3 text-lg;
}

.app-login-btn-base {
  @apply text-gray-700 hover:text-purple-600 hover:bg-purple-50;
}

.app-register-btn-base {
  @apply bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md;
}

.app-auth-btn-icon {
  @apply w-5 h-5;
}

.app-auth-btn-text {
  @apply hidden sm:inline;
}

/* Quick Actions */
.app-quick-actions-base {
  @apply hidden lg:flex items-center gap-1;
}

.app-quick-actions-lg {
  @apply gap-2;
}

.app-quick-action-btn-base {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg 
         transition-colors;
}

.app-quick-action-btn-lg {
  @apply p-2.5;
}

.app-quick-action-icon {
  @apply w-5 h-5;
}

/* User Menu */
.app-user-menu-base {
  @apply relative;
}

.app-user-menu-trigger-base {
  @apply flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors;
}

.app-user-menu-trigger-lg {
  @apply p-2;
}

.app-user-menu-trigger-active {
  @apply bg-gray-100;
}

.app-user-avatar-base {
  @apply rounded-full object-cover ring-2 ring-purple-100;
}

.app-user-avatar-sm {
  @apply w-6 h-6;
}

.app-user-avatar-md {
  @apply w-8 h-8 lg:w-10 lg:h-10;
}

.app-user-avatar-lg {
  @apply w-10 h-10 lg:w-12 lg:h-12;
}

.app-user-info-base {
  @apply hidden lg:block text-left;
}

.app-user-info-lg {
  @apply block;
}

.app-user-name {
  @apply text-sm font-semibold text-gray-900 leading-tight;
}

.app-user-role {
  @apply text-xs text-gray-500;
}

.app-user-menu-chevron-base {
  @apply hidden lg:block w-4 h-4 text-gray-600 transition-transform;
}

.app-user-menu-chevron-lg {
  @apply block;
}

.app-user-menu-chevron-rotated {
  @apply rotate-180;
}

/* User Dropdown */
.app-user-dropdown-base {
  @apply absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border border-gray-100 
         py-2 overflow-hidden;
}

.app-user-dropdown-lg {
  @apply w-72 mt-4;
}

.app-user-dropdown-header-base {
  @apply px-4 py-3 border-b border-gray-100;
}

.app-user-dropdown-header-lg {
  @apply px-5 py-4;
}

.app-user-dropdown-name {
  @apply font-semibold text-gray-900;
}

.app-user-dropdown-email {
  @apply text-sm text-gray-500;
}

.app-user-dropdown-role {
  @apply mt-1;
}

.app-user-role-badge-base {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.app-user-role-badge-client {
  @apply bg-blue-100 text-blue-800;
}

.app-user-role-badge-artist {
  @apply bg-purple-100 text-purple-800;
}

.app-user-role-badge-admin {
  @apply bg-red-100 text-red-800;
}

.app-user-dropdown-menu-base {
  @apply py-2;
}

.app-user-dropdown-item-base {
  @apply flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-purple-50 
         hover:text-purple-600 transition-colors;
}

.app-user-dropdown-item-lg {
  @apply px-5 py-3;
}

.app-user-dropdown-item-active {
  @apply bg-purple-50 text-purple-600;
}

.app-user-dropdown-item-icon {
  @apply w-5 h-5;
}

.app-user-dropdown-item-text {
  @apply flex-1;
}

.app-user-dropdown-item-badge {
  @apply w-4 h-4 text-amber-500;
}

/* Role Switch */
.app-role-switch-base {
  @apply border-t border-gray-100 pt-2 px-4 pb-2;
}

.app-role-switch-lg {
  @apply px-5;
}

.app-role-switch-label {
  @apply text-xs font-medium text-gray-500 mb-2;
}

.app-role-switch-options {
  @apply flex gap-1;
}

.app-role-switch-btn-base {
  @apply px-2 py-1 text-xs rounded border border-gray-200 hover:border-purple-300 
         hover:bg-purple-50 transition-colors;
}

.app-role-switch-btn-active {
  @apply border-purple-500 bg-purple-50 text-purple-700;
}

.app-user-dropdown-footer-base {
  @apply border-t border-gray-100 pt-2;
}

.app-logout-btn-base {
  @apply w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 
         transition-colors;
}

.app-logout-btn-lg {
  @apply px-5 py-3;
}

.app-logout-btn-icon {
  @apply w-5 h-5;
}

.app-logout-btn-text {
  @apply flex-1 text-left;
}

/* Mobile Menu Toggle */
.app-mobile-menu-toggle-base {
  @apply lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors;
}

.app-mobile-menu-toggle-lg {
  @apply p-2.5;
}

.app-mobile-menu-icon {
  @apply w-6 h-6 text-gray-600;
}

/* Mobile Menu */
.app-mobile-menu-base {
  @apply lg:hidden border-t border-gray-100 bg-white;
}

.app-mobile-nav-base {
  @apply page-container py-4 space-y-1;
}

.app-mobile-nav-lg {
  @apply py-5 space-y-2;
}

.app-mobile-nav-link-base {
  @apply flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 
         hover:text-purple-600 rounded-lg font-medium transition-colors;
}

.app-mobile-nav-link-lg {
  @apply px-5 py-4;
}

.app-mobile-nav-link-active {
  @apply bg-purple-50 text-purple-600;
}

.app-mobile-nav-link-icon {
  @apply w-5 h-5;
}

.app-mobile-nav-link-text {
  @apply flex-1;
}

.app-mobile-nav-link-badge {
  @apply w-4 h-4 text-amber-500;
}

.app-mobile-register-link-base {
  @apply bg-purple-600 text-white hover:bg-purple-700;
}

/* Mobile User Section */
.app-mobile-user-section-base {
  @apply border-t border-gray-100 pt-4 mt-4;
}

.app-mobile-user-info-base {
  @apply flex items-center gap-3 px-4 py-3 mb-3;
}

.app-mobile-user-info-lg {
  @apply px-5 py-4;
}

.app-mobile-user-avatar-base {
  @apply w-12 h-12 rounded-full object-cover ring-2 ring-purple-100;
}

.app-mobile-user-avatar-lg {
  @apply w-14 h-14;
}

.app-mobile-user-details {
  @apply flex-1;
}

.app-mobile-user-name {
  @apply font-semibold text-gray-900;
}

.app-mobile-user-role-base {
  @apply text-sm;
}

.app-mobile-user-role-client {
  @apply text-blue-600;
}

.app-mobile-user-role-artist {
  @apply text-purple-600;
}

.app-mobile-user-role-admin {
  @apply text-red-600;
}

.app-mobile-user-menu-base {
  @apply space-y-1;
}

/* Notifications Panel */
.app-notifications-overlay-base {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end;
}

.app-notifications-panel-base {
  @apply bg-white w-full max-w-md h-full shadow-2xl overflow-hidden flex flex-col;
}

.app-notifications-panel-lg {
  @apply max-w-lg;
}

.app-notifications-header-base {
  @apply flex items-center justify-between p-4 border-b border-gray-100;
}

.app-notifications-header-lg {
  @apply p-5;
}

.app-notifications-title {
  @apply text-lg font-semibold text-gray-900;
}

.app-notifications-actions {
  @apply flex items-center gap-2;
}

.app-notifications-action-btn-base {
  @apply text-sm text-purple-600 hover:text-purple-700 font-medium;
}

.app-notifications-close-btn-base {
  @apply p-1 hover:bg-gray-100 rounded transition-colors;
}

.app-notifications-content-base {
  @apply flex-1 overflow-y-auto;
}

.app-notifications-empty {
  @apply flex flex-col items-center justify-center h-full text-gray-500;
}

.app-notifications-empty-icon {
  @apply w-12 h-12 mb-3;
}

.app-notifications-empty-text {
  @apply text-sm;
}

.app-notifications-list {
  @apply divide-y divide-gray-100;
}

.app-notification-item-base {
  @apply flex items-start gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors;
}

.app-notification-item-lg {
  @apply p-5;
}

.app-notification-item-unread {
  @apply bg-blue-50/50;
}

.app-notification-icon-base {
  @apply flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center;
}

.app-notification-icon-order {
  @apply bg-green-100 text-green-600;
}

.app-notification-icon-message {
  @apply bg-blue-100 text-blue-600;
}

.app-notification-icon-system {
  @apply bg-gray-100 text-gray-600;
}

.app-notification-icon-payment {
  @apply bg-yellow-100 text-yellow-600;
}

.app-notification-icon-review {
  @apply bg-purple-100 text-purple-600;
}

.app-notification-content {
  @apply flex-1 min-w-0;
}

.app-notification-title {
  @apply font-medium text-gray-900 mb-1;
}

.app-notification-message {
  @apply text-sm text-gray-600 mb-1;
}

.app-notification-time {
  @apply text-xs text-gray-500;
}

.app-notification-unread-indicator {
  @apply w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .app-auth-btn-text {
    @apply hidden;
  }
  
  .app-user-info-base {
    @apply hidden;
  }
  
  .app-quick-actions-base {
    @apply hidden;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .app-header-base {
    @apply border-2;
  }
  
  .app-action-btn,
  .app-auth-btn {
    @apply border border-gray-300;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .app-nav-link-indicator-base,
  .app-user-menu-chevron-base,
  .app-action-btn {
    @apply transition-none;
  }
}

/* Dark mode support (future enhancement) */
@media (prefers-color-scheme: dark) {
  .app-header-base {
    @apply bg-gray-900/95 border-gray-800;
  }
  
  .app-nav-link-base {
    @apply text-gray-300 hover:text-white hover:bg-gray-800;
  }
}
</style>