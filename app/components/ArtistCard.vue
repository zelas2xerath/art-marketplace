<!--
  ArtistCard Component
  画师卡片组件
-->

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <NuxtLink :to="`/artists/${artist.id}`" class="block">
      <!-- Artist Avatar -->
      <div class="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          :src="artist.avatar || '/placeholder-artist.jpg'"
          :alt="artist.name"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        
        <!-- Status Badge -->
        <div class="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-medium glass-medium"
             :class="statusBadgeClass">
          {{ statusText }}
        </div>
        
        <!-- Verification Badge -->
        <div v-if="artist.isVerified" class="absolute top-3 left-3 p-2 surface-heavy rounded-full shadow-sm">
          <Icon name="heroicons:check-badge" class="w-5 h-5 text-primary-600" />
        </div>
      </div>

      <!-- Artist Info -->
      <div class="p-5">
        <!-- Name and Rating -->
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-semibold text-gray-900 text-lg truncate flex-1 leading-tight">
            {{ artist.name }}
          </h3>
          <div class="flex items-center gap-1.5 ml-3 bg-yellow-50 px-2 py-1 rounded-lg">
            <Icon name="heroicons:star-solid" class="w-4 h-4 text-yellow-500" />
            <span class="text-sm font-medium text-yellow-700">{{ (artist.rating || 5.0).toFixed(1) }}</span>
          </div>
        </div>

        <!-- Bio -->
        <p v-if="artist.bio" class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {{ artist.bio }}
        </p>

        <!-- Specialties -->
        <div v-if="artist.specialties && artist.specialties.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span
            v-for="specialty in artist.specialties.slice(0, 3)"
            :key="specialty"
            class="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium border border-primary-100"
          >
            {{ specialty }}
          </span>
        </div>

        <!-- Stats -->
        <div class="flex items-center justify-between text-sm text-gray-500 mb-4 bg-gray-50 rounded-lg px-3 py-2">
          <div class="flex items-center gap-1">
            <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4" />
            <span>{{ formatNumber(artist.reviewCount || 0) }} 评价</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon name="heroicons:photo" class="w-4 h-4" />
            <span>{{ formatNumber(artist.artworkCount || 0) }} 作品</span>
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-2 mb-5">
          <span class="text-sm text-gray-500">起价</span>
          <span class="text-2xl font-bold text-primary-600">¥{{ formatPrice(artist.basePrice || 0) }}</span>
        </div>

        <!-- Actions -->
        <div v-if="showActions" class="flex gap-3">
          <button
            @click.prevent="handleFollow"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200"
            :class="followButtonClass"
          >
            <Icon :name="followIcon" class="w-4 h-4" />
            {{ followText }}
          </button>
          
          <button
            v-if="onMessage"
            @click.prevent="handleMessage"
            class="px-3 py-2.5 surface-light border border-gray-200 rounded-lg hover:surface-medium transition-all duration-200 group"
          >
            <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 text-gray-600 group-hover:text-primary-600" />
          </button>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { ComponentSize } from '~/types/design-tokens'

export interface ArtistCardProps {
  artist: {
    id: string
    name: string
    avatar: string
    bio?: string
    specialties?: string[]
    rating?: number
    reviewCount?: number
    artworkCount?: number
    followerCount?: number
    basePrice?: number
    status?: 'ready' | 'busy' | 'offline'
    isFollowing: boolean
    isVerified?: boolean
  }
  variant?: 'grid' | 'list' | 'featured'
  size?: ComponentSize
  showActions?: boolean
  onFollow?: (artistId: string) => void
  onMessage?: (artistId: string) => void
}

const props = withDefaults(defineProps<ArtistCardProps>(), {
  variant: 'grid',
  size: 'md',
  showActions: true,
})

const emit = defineEmits<{
  follow: [artistId: string]
  message: [artistId: string]
}>()

// Computed properties for styling
const statusBadgeClass = computed(() => {
  switch (props.artist.status) {
    case 'ready':
      return 'text-green-800 border border-green-200'
    case 'busy':
      return 'text-yellow-800 border border-yellow-200'
    case 'offline':
    default:
      return 'text-gray-800 border border-gray-200'
  }
})

const statusText = computed(() => {
  switch (props.artist.status) {
    case 'ready':
      return '接单中'
    case 'busy':
      return '忙碌'
    case 'offline':
    default:
      return '休息中'
  }
})

const followButtonClass = computed(() => {
  return props.artist.isFollowing
    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
})

const followText = computed(() => {
  return props.artist.isFollowing ? '已关注' : '关注'
})

const followIcon = computed(() => {
  return props.artist.isFollowing ? 'heroicons:user-minus' : 'heroicons:user-plus'
})

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatPrice = (price: number): string => {
  return price.toLocaleString('zh-CN')
}

// Event handlers
const handleFollow = (): void => {
  if (props.onFollow) {
    props.onFollow(props.artist.id)
  }
  emit('follow', props.artist.id)
}

const handleMessage = (): void => {
  if (props.onMessage) {
    props.onMessage(props.artist.id)
  }
  emit('message', props.artist.id)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 增强的卡片悬停效果 */
.artist-card-enhanced {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.artist-card-enhanced:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

/* 状态指示器动画 */
.status-indicator {
  position: relative;
}

.status-indicator::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  transform: translateY(-50%);
}

.status-ready::before {
  background-color: #10b981;
  animation: pulse 2s infinite;
}

.status-busy::before {
  background-color: #f59e0b;
}

.status-offline::before {
  background-color: #6b7280;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>