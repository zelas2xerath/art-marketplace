<!--
  ArtistCard Component
  画师卡片组件
  
  Enhanced artist card component with multiple variants, sizes, and interactive features.
  
  Features:
  - Multiple variants (grid, list, featured)
  - Multiple sizes (sm, md, lg)
  - Interactive actions (follow, message)
  - Specialties display
  - Rating and review system
  - Status indicators
  - Verification badges
  - Responsive design
  - Accessibility support
-->

<template>
  <div class="artist-card" :class="cardClasses">
    <!-- Grid/Featured Variant -->
    <template v-if="variant === 'grid' || variant === 'featured'">
      <NuxtLink
        :to="`/artists/${artist.id}`"
        class="artist-card-link"
        :class="linkClasses"
      >
        <!-- Avatar Container -->
        <div class="artist-avatar-container" :class="avatarContainerClasses">
          <img
            :src="artist.avatar || '/placeholder-artist.jpg'"
            :alt="artist.name"
            class="artist-avatar"
            :class="avatarClasses"
            loading="lazy"
          />

          <!-- Status Badge -->
          <div class="artist-status-badge" :class="statusBadgeClasses">
            <span class="artist-status-text" :class="statusTextClasses">
              {{ getStatusText(artist.status) }}
            </span>
          </div>

          <!-- Verification Badge -->
          <div
            v-if="artist.isVerified"
            class="artist-verification-badge"
            :class="verificationBadgeClasses"
          >
            <Icon name="heroicons:check-badge" class="artist-verification-icon" />
          </div>

          <!-- Overlay Actions (Featured variant) -->
          <div
            v-if="variant === 'featured' && showActions"
            class="artist-overlay-actions"
            :class="overlayActionsClasses"
          >
            <button
              @click.prevent="handleFollow"
              class="artist-overlay-action-btn"
              :class="followButtonClasses"
              :aria-label="artist.isFollowing ? '取消关注' : '关注画师'"
            >
              <Icon
                :name="artist.isFollowing ? 'heroicons:user-minus' : 'heroicons:user-plus'"
                class="w-5 h-5"
              />
            </button>
            
            <button
              v-if="onMessage"
              @click.prevent="handleMessage"
              class="artist-overlay-action-btn"
              :aria-label="'发送消息'"
            >
              <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="artist-content" :class="contentClasses">
          <div class="artist-header">
            <h3 class="artist-name" :class="nameClasses">
              {{ artist.name }}
              <Icon
                v-if="artist.isVerified"
                name="heroicons:check-badge"
                class="artist-inline-verification"
                :class="inlineVerificationClasses"
              />
            </h3>
            
            <div v-if="variant === 'featured'" class="artist-follower-count">
              <span class="text-sm text-gray-500">
                {{ formatNumber(artist.followerCount || 0) }} 关注者
              </span>
            </div>
          </div>

          <!-- Bio -->
          <p v-if="artist.bio" class="artist-bio" :class="bioClasses">
            {{ artist.bio }}
          </p>

          <!-- Specialties -->
          <div v-if="artist.specialties && artist.specialties.length > 0" class="artist-specialties">
            <span
              v-for="specialty in artist.specialties.slice(0, variant === 'featured' ? 5 : 3)"
              :key="specialty"
              class="artist-specialty-tag"
              :class="specialtyTagClasses"
            >
              {{ specialty }}
            </span>
          </div>

          <!-- Stats -->
          <div class="artist-stats" :class="statsClasses">
            <div class="artist-rating">
              <div class="flex items-center gap-1">
                <Icon name="heroicons:star-solid" class="artist-star-icon" />
                <span class="artist-rating-value">{{ artist.rating?.toFixed(1) || '5.0' }}</span>
              </div>
              <span class="artist-review-count">
                ({{ formatNumber(artist.reviewCount || 0) }})
              </span>
            </div>

            <div class="artist-artwork-count">
              <span class="text-sm text-gray-500">
                {{ formatNumber(artist.artworkCount || 0) }} 作品
              </span>
            </div>
          </div>

          <!-- Price -->
          <div class="artist-price" :class="priceClasses">
            <span class="artist-price-label">起价</span>
            <span class="artist-price-value">¥{{ formatPrice(artist.basePrice || 0) }}</span>
          </div>

          <!-- Actions (Grid variant) -->
          <div
            v-if="variant === 'grid' && showActions"
            class="artist-actions"
            :class="actionsClasses"
          >
            <button
              @click.prevent="handleFollow"
              class="artist-action-btn artist-follow-btn"
              :class="followActionButtonClasses"
            >
              <Icon
                :name="artist.isFollowing ? 'heroicons:user-minus' : 'heroicons:user-plus'"
                class="w-4 h-4"
              />
              {{ artist.isFollowing ? '已关注' : '关注' }}
            </button>
            
            <button
              v-if="onMessage"
              @click.prevent="handleMessage"
              class="artist-action-btn artist-message-btn"
              :class="messageActionButtonClasses"
            >
              <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4" />
              消息
            </button>
          </div>
        </div>
      </NuxtLink>
    </template>

    <!-- List Variant -->
    <template v-else-if="variant === 'list'">
      <NuxtLink
        :to="`/artists/${artist.id}`"
        class="artist-card-link artist-card-list"
        :class="linkClasses"
      >
        <!-- Avatar -->
        <div class="artist-list-avatar-container" :class="listAvatarContainerClasses">
          <img
            :src="artist.avatar || '/placeholder-artist.jpg'"
            :alt="artist.name"
            class="artist-list-avatar"
            :class="listAvatarClasses"
            loading="lazy"
          />
          
          <!-- Status Indicator -->
          <div class="artist-list-status-indicator" :class="listStatusIndicatorClasses">
          </div>
          
          <!-- Verification Badge -->
          <div
            v-if="artist.isVerified"
            class="artist-list-verification-badge"
          >
            <Icon name="heroicons:check-badge" class="w-4 h-4 text-blue-500" />
          </div>
        </div>

        <!-- Content -->
        <div class="artist-list-content" :class="listContentClasses">
          <div class="artist-list-header">
            <div class="artist-list-name-section">
              <h3 class="artist-name" :class="nameClasses">
                {{ artist.name }}
              </h3>
              
              <div class="artist-list-status">
                <span class="artist-list-status-text" :class="listStatusTextClasses">
                  {{ getStatusText(artist.status) }}
                </span>
              </div>
            </div>
            
            <div class="artist-list-price">
              <span class="text-sm text-gray-500">起价</span>
              <span class="font-semibold text-lg">¥{{ formatPrice(artist.basePrice || 0) }}</span>
            </div>
          </div>

          <!-- Bio -->
          <p v-if="artist.bio" class="artist-bio" :class="bioClasses">
            {{ artist.bio }}
          </p>

          <!-- Specialties -->
          <div v-if="artist.specialties && artist.specialties.length > 0" class="artist-list-specialties">
            <span
              v-for="specialty in artist.specialties.slice(0, 4)"
              :key="specialty"
              class="artist-list-specialty-tag"
            >
              {{ specialty }}
            </span>
          </div>

          <!-- Stats and Actions -->
          <div class="artist-list-footer">
            <div class="artist-stats" :class="statsClasses">
              <div class="artist-rating">
                <Icon name="heroicons:star-solid" class="artist-star-icon" />
                <span class="artist-rating-value">{{ artist.rating?.toFixed(1) || '5.0' }}</span>
                <span class="artist-review-count">({{ formatNumber(artist.reviewCount || 0) }})</span>
              </div>
              
              <div class="artist-artwork-count">
                <span class="text-sm text-gray-500">
                  {{ formatNumber(artist.artworkCount || 0) }} 作品
                </span>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="showActions" class="artist-list-actions">
              <button
                @click.prevent="handleFollow"
                class="artist-list-action-btn"
                :class="{ 'artist-list-action-btn-following': artist.isFollowing }"
                :aria-label="artist.isFollowing ? '取消关注' : '关注画师'"
              >
                <Icon
                  :name="artist.isFollowing ? 'heroicons:user-minus' : 'heroicons:user-plus'"
                  class="w-4 h-4"
                />
              </button>
              
              <button
                v-if="onMessage"
                @click.prevent="handleMessage"
                class="artist-list-action-btn"
                :aria-label="'发送消息'"
              >
                <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

// Computed classes
const cardClasses = computed(() => [
  'artist-card-base',
  `artist-card-${props.variant}`,
  `artist-card-${props.size}`,
])

const linkClasses = computed(() => [
  'artist-link-base',
  `artist-link-${props.variant}`,
  `artist-link-${props.size}`,
])

const avatarContainerClasses = computed(() => [
  'artist-avatar-container-base',
  `artist-avatar-container-${props.variant}`,
  `artist-avatar-container-${props.size}`,
])

const avatarClasses = computed(() => [
  'artist-avatar-base',
  `artist-avatar-${props.variant}`,
  `artist-avatar-${props.size}`,
])

const statusBadgeClasses = computed(() => [
  'artist-status-badge-base',
  `artist-status-badge-${props.artist.status || 'offline'}`,
  `artist-status-badge-${props.size}`,
])

const statusTextClasses = computed(() => [
  'artist-status-text-base',
  `artist-status-text-${props.artist.status || 'offline'}`,
])

const verificationBadgeClasses = computed(() => [
  'artist-verification-badge-base',
  `artist-verification-badge-${props.size}`,
])

const overlayActionsClasses = computed(() => [
  'artist-overlay-actions-base',
  `artist-overlay-actions-${props.size}`,
])

const followButtonClasses = computed(() => [
  'artist-follow-overlay-btn',
  { 'artist-follow-overlay-btn-following': props.artist.isFollowing },
])

const contentClasses = computed(() => [
  'artist-content-base',
  `artist-content-${props.variant}`,
  `artist-content-${props.size}`,
])

const nameClasses = computed(() => [
  'artist-name-base',
  `artist-name-${props.variant}`,
  `artist-name-${props.size}`,
])

const inlineVerificationClasses = computed(() => [
  'artist-inline-verification-base',
  `artist-inline-verification-${props.size}`,
])

const bioClasses = computed(() => [
  'artist-bio-base',
  `artist-bio-${props.variant}`,
  `artist-bio-${props.size}`,
])

const specialtyTagClasses = computed(() => [
  'artist-specialty-tag-base',
  `artist-specialty-tag-${props.size}`,
])

const statsClasses = computed(() => [
  'artist-stats-base',
  `artist-stats-${props.variant}`,
  `artist-stats-${props.size}`,
])

const priceClasses = computed(() => [
  'artist-price-base',
  `artist-price-${props.variant}`,
  `artist-price-${props.size}`,
])

const actionsClasses = computed(() => [
  'artist-actions-base',
  `artist-actions-${props.size}`,
])

const followActionButtonClasses = computed(() => [
  'artist-follow-action-btn',
  { 'artist-follow-action-btn-following': props.artist.isFollowing },
])

const messageActionButtonClasses = computed(() => [
  'artist-message-action-btn',
])

// List variant specific classes
const listAvatarContainerClasses = computed(() => [
  'artist-list-avatar-container-base',
  `artist-list-avatar-container-${props.size}`,
])

const listAvatarClasses = computed(() => [
  'artist-list-avatar-base',
  `artist-list-avatar-${props.size}`,
])

const listStatusIndicatorClasses = computed(() => [
  'artist-list-status-indicator-base',
  `artist-list-status-indicator-${props.artist.status || 'offline'}`,
])

const listStatusTextClasses = computed(() => [
  'artist-list-status-text-base',
  `artist-list-status-text-${props.artist.status || 'offline'}`,
])

const listContentClasses = computed(() => [
  'artist-list-content-base',
  `artist-list-content-${props.size}`,
])

// Event handlers
const handleFollow = () => {
  if (props.onFollow) {
    props.onFollow(props.artist.id)
  }
  emit('follow', props.artist.id)
}

const handleMessage = () => {
  if (props.onMessage) {
    props.onMessage(props.artist.id)
  }
  emit('message', props.artist.id)
}

// Utility functions
const getStatusText = (status?: string): string => {
  const statusMap = {
    ready: '接单中',
    busy: '忙碌',
    offline: '休息中'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}

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
  return price.toLocaleString()
}
</script>

<style scoped>
/* Base Card Styles */
.artist-card-base {
  @apply w-full;
}

.artist-card-grid,
.artist-card-featured {
  @apply block;
}

.artist-card-list {
  @apply block;
}

/* Link Styles */
.artist-link-base {
  @apply group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl 
         transition-all duration-300 border border-gray-100 hover:border-gray-200;
}

.artist-link-grid,
.artist-link-featured {
  @apply flex flex-col;
}

.artist-card-list {
  @apply flex gap-4;
}

/* Avatar Container */
.artist-avatar-container-base {
  @apply relative overflow-hidden bg-gray-100;
}

.artist-avatar-container-grid {
  @apply aspect-square;
}

.artist-avatar-container-featured {
  @apply aspect-[4/3];
}

.artist-avatar-container-sm {
  @apply rounded-lg;
}

.artist-avatar-container-md {
  @apply rounded-lg;
}

.artist-avatar-container-lg {
  @apply rounded-xl;
}

/* Avatar */
.artist-avatar-base {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.artist-avatar-grid {
  @apply group-hover:scale-110;
}

.artist-avatar-featured {
  @apply group-hover:scale-105;
}

/* Status Badge */
.artist-status-badge-base {
  @apply absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm;
}

.artist-status-badge-ready {
  @apply bg-green-100/90 text-green-800;
}

.artist-status-badge-busy {
  @apply bg-amber-100/90 text-amber-800;
}

.artist-status-badge-offline {
  @apply bg-gray-100/90 text-gray-800;
}

.artist-status-badge-sm {
  @apply top-2 right-2 px-2 py-0.5 text-xs;
}

.artist-status-badge-lg {
  @apply top-4 right-4 px-4 py-2 text-sm;
}

/* Verification Badge */
.artist-verification-badge-base {
  @apply absolute top-3 left-3 p-1 bg-white/90 backdrop-blur-sm rounded-full;
}

.artist-verification-badge-sm {
  @apply top-2 left-2;
}

.artist-verification-badge-lg {
  @apply top-4 left-4 p-2;
}

.artist-verification-icon {
  @apply w-5 h-5 text-blue-500;
}

/* Overlay Actions */
.artist-overlay-actions-base {
  @apply absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 
         transition-opacity duration-300 flex items-center justify-center gap-3;
}

.artist-overlay-actions-sm {
  @apply gap-2;
}

.artist-overlay-actions-lg {
  @apply gap-4;
}

.artist-overlay-action-btn {
  @apply p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white 
         transition-colors shadow-sm hover:shadow-md;
}

.artist-follow-overlay-btn-following {
  @apply bg-primary-100 hover:bg-primary-200 text-primary-700;
}

/* Content */
.artist-content-base {
  @apply p-4;
}

.artist-content-grid {
  @apply flex-1;
}

.artist-content-featured {
  @apply flex-1;
}

.artist-content-sm {
  @apply p-3;
}

.artist-content-lg {
  @apply p-5;
}

/* Header */
.artist-header {
  @apply mb-3;
}

/* Name */
.artist-name-base {
  @apply font-semibold text-gray-900 mb-1 group-hover:text-primary-600 
         transition-colors flex items-center gap-2;
}

.artist-name-grid {
  @apply text-lg;
}

.artist-name-featured {
  @apply text-xl;
}

.artist-name-list {
  @apply text-base;
}

.artist-name-sm {
  @apply text-base mb-1;
}

.artist-name-lg {
  @apply text-2xl mb-2;
}

.artist-inline-verification-base {
  @apply text-blue-500 shrink-0;
}

.artist-inline-verification-sm {
  @apply w-4 h-4;
}

.artist-inline-verification-md {
  @apply w-5 h-5;
}

.artist-inline-verification-lg {
  @apply w-6 h-6;
}

/* Follower Count */
.artist-follower-count {
  @apply mt-1;
}

/* Bio */
.artist-bio-base {
  @apply text-gray-600 mb-3;
}

.artist-bio-grid {
  @apply text-sm line-clamp-2;
}

.artist-bio-featured {
  @apply text-base line-clamp-3;
}

.artist-bio-list {
  @apply text-sm line-clamp-2;
}

.artist-bio-sm {
  @apply text-xs mb-2;
}

.artist-bio-lg {
  @apply text-base mb-4;
}

/* Specialties */
.artist-specialties {
  @apply flex flex-wrap gap-1 mb-3;
}

.artist-specialty-tag-base {
  @apply px-2 py-1 bg-primary-50 text-primary-700 rounded text-xs font-medium;
}

.artist-specialty-tag-sm {
  @apply px-1.5 py-0.5 text-xs;
}

.artist-specialty-tag-lg {
  @apply px-3 py-1.5 text-sm;
}

/* Stats */
.artist-stats-base {
  @apply flex items-center justify-between mb-3;
}

.artist-stats-sm {
  @apply mb-2;
}

.artist-stats-lg {
  @apply mb-4;
}

.artist-rating {
  @apply flex items-center gap-2;
}

.artist-star-icon {
  @apply w-4 h-4 text-amber-400;
}

.artist-rating-value {
  @apply font-semibold text-gray-900;
}

.artist-review-count {
  @apply text-sm text-gray-500;
}

.artist-artwork-count {
  @apply text-sm text-gray-500;
}

/* Price */
.artist-price-base {
  @apply flex items-baseline gap-2 mb-4;
}

.artist-price-sm {
  @apply mb-3;
}

.artist-price-lg {
  @apply mb-5;
}

.artist-price-label {
  @apply text-sm text-gray-500;
}

.artist-price-value {
  @apply text-xl font-bold text-primary-600;
}

/* Actions */
.artist-actions-base {
  @apply flex gap-2;
}

.artist-actions-sm {
  @apply gap-1.5;
}

.artist-actions-lg {
  @apply gap-3;
}

.artist-action-btn {
  @apply flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg 
         font-medium transition-colors;
}

.artist-follow-action-btn {
  @apply bg-primary-600 text-white hover:bg-primary-700;
}

.artist-follow-action-btn-following {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

.artist-message-action-btn {
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
}

/* List Variant Specific Styles */
.artist-list-avatar-container-base {
  @apply relative shrink-0 rounded-full overflow-hidden;
}

.artist-list-avatar-container-sm {
  @apply w-12 h-12;
}

.artist-list-avatar-container-md {
  @apply w-16 h-16;
}

.artist-list-avatar-container-lg {
  @apply w-20 h-20;
}

.artist-list-avatar-base {
  @apply w-full h-full object-cover;
}

.artist-list-status-indicator-base {
  @apply absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white;
}

.artist-list-status-indicator-ready {
  @apply bg-green-400;
}

.artist-list-status-indicator-busy {
  @apply bg-amber-400;
}

.artist-list-status-indicator-offline {
  @apply bg-gray-400;
}

.artist-list-verification-badge {
  @apply absolute -top-1 -right-1;
}

.artist-list-content-base {
  @apply flex-1 min-w-0;
}

.artist-list-header {
  @apply flex items-start justify-between gap-4 mb-2;
}

.artist-list-name-section {
  @apply flex-1 min-w-0;
}

.artist-list-status {
  @apply mt-1;
}

.artist-list-status-text-base {
  @apply text-xs font-medium;
}

.artist-list-status-text-ready {
  @apply text-green-600;
}

.artist-list-status-text-busy {
  @apply text-amber-600;
}

.artist-list-status-text-offline {
  @apply text-gray-500;
}

.artist-list-price {
  @apply text-right shrink-0;
}

.artist-list-specialties {
  @apply flex flex-wrap gap-1 mb-3;
}

.artist-list-specialty-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs;
}

.artist-list-footer {
  @apply flex items-center justify-between;
}

.artist-list-actions {
  @apply flex items-center gap-2;
}

.artist-list-action-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg 
         transition-colors;
}

.artist-list-action-btn-following {
  @apply text-primary-500 hover:text-primary-600 bg-primary-50 hover:bg-primary-100;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .artist-card-list .artist-link-base {
    @apply flex-col;
  }
  
  .artist-list-avatar-container-base {
    @apply w-full aspect-square;
  }
  
  .artist-list-header {
    @apply flex-col items-start gap-2;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .artist-link-base {
    @apply border-2;
  }
  
  .artist-overlay-action-btn,
  .artist-action-btn {
    @apply border border-gray-300;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .artist-avatar-base,
  .artist-link-base,
  .artist-overlay-actions-base {
    @apply transition-none;
  }
}
</style>