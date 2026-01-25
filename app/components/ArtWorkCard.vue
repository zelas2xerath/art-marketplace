<!--
  ArtworkCard Component
  作品卡片组件
  
  Enhanced artwork card component with multiple variants, sizes, and interactive features.
  
  Features:
  - Multiple variants (grid, list, featured)
  - Multiple sizes (sm, md, lg)
  - Interactive actions (like, add to cart, quick view)
  - Price display with discount support
  - Tag system
  - Responsive design
  - Accessibility support
-->

<template>
  <div class="artwork-card" :class="cardClasses">
    <!-- Grid/Featured Variant -->
    <template v-if="variant === 'grid' || variant === 'featured'">
      <NuxtLink
        :to="`/artworks/${artwork.id}`"
        class="artwork-card-link"
        :class="linkClasses"
      >
        <!-- Image Container -->
        <div class="artwork-image-container" :class="imageContainerClasses">
          <img
            :src="artwork.image || '/placeholder-artwork.jpg'"
            :alt="artwork.title"
            class="artwork-image"
            :class="imageClasses"
            loading="lazy"
          />

          <!-- Overlay -->
          <div class="artwork-overlay" :class="overlayClasses">
            <div class="artwork-overlay-content" :class="overlayContentClasses">
              <p v-if="artwork.tags && artwork.tags.length > 0" class="artwork-tags">
                <span
                  v-for="tag in artwork.tags.slice(0, 3)"
                  :key="tag"
                  class="artwork-tag"
                >
                  {{ tag }}
                </span>
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="showActions" class="artwork-actions" :class="actionsClasses">
            <button
              @click.prevent="handleLike"
              class="artwork-action-btn"
              :class="likeButtonClasses"
              :aria-label="artwork.isLiked ? '取消点赞' : '点赞'"
            >
              <Icon
                :name="artwork.isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                :class="likeIconClasses"
              />
            </button>
            
            <button
              v-if="onAddToCart"
              @click.prevent="handleAddToCart"
              class="artwork-action-btn"
              :aria-label="'添加到购物车'"
            >
              <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
            </button>
            
            <button
              v-if="onQuickView"
              @click.prevent="handleQuickView"
              class="artwork-action-btn"
              :aria-label="'快速预览'"
            >
              <Icon name="heroicons:eye" class="w-5 h-5" />
            </button>
          </div>

          <!-- Price Badge (Featured variant) -->
          <div
            v-if="variant === 'featured' && artwork.price"
            class="artwork-price-badge"
            :class="priceBadgeClasses"
          >
            <PriceDisplay
              :price="artwork.price"
              :original-price="artwork.originalPrice"
              :currency="'¥'"
              :size="size === 'lg' ? 'md' : 'sm'"
              :show-discount="!!artwork.originalPrice"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="artwork-content" :class="contentClasses">
          <h3 class="artwork-title" :class="titleClasses">
            {{ artwork.title }}
          </h3>

          <!-- Artist Info -->
          <div class="artwork-artist" :class="artistClasses">
            <img
              :src="artwork.artist.avatar || '/placeholder-avatar.jpg'"
              :alt="artwork.artist.name"
              class="artwork-artist-avatar"
              :class="avatarClasses"
            />
            <span class="artwork-artist-name" :class="artistNameClasses">
              {{ artwork.artist.name }}
            </span>
            <Icon
              v-if="artwork.artist.isVerified"
              name="heroicons:check-badge"
              class="artwork-verified-badge"
              :class="verifiedBadgeClasses"
            />
          </div>

          <!-- Stats -->
          <div class="artwork-stats" :class="statsClasses">
            <div class="artwork-stat">
              <Icon name="heroicons:heart" class="artwork-stat-icon" />
              <span>{{ formatNumber(artwork.likes) }}</span>
            </div>
            <div class="artwork-stat">
              <Icon name="heroicons:eye" class="artwork-stat-icon" />
              <span>{{ formatNumber(artwork.views || 0) }}</span>
            </div>
            <time
              v-if="artwork.createdAt"
              :datetime="artwork.createdAt.toISOString()"
              class="artwork-date"
            >
              {{ formatDate(artwork.createdAt) }}
            </time>
          </div>

          <!-- Price (Grid variant) -->
          <div
            v-if="variant === 'grid' && artwork.price"
            class="artwork-price"
            :class="priceClasses"
          >
            <PriceDisplay
              :price="artwork.price"
              :original-price="artwork.originalPrice"
              :currency="'¥'"
              :size="size === 'lg' ? 'md' : 'sm'"
              :show-discount="!!artwork.originalPrice"
            />
          </div>
        </div>
      </NuxtLink>
    </template>

    <!-- List Variant -->
    <template v-else-if="variant === 'list'">
      <NuxtLink
        :to="`/artworks/${artwork.id}`"
        class="artwork-card-link artwork-card-list"
        :class="linkClasses"
      >
        <!-- Image -->
        <div class="artwork-list-image-container" :class="listImageContainerClasses">
          <img
            :src="artwork.image || '/placeholder-artwork.jpg'"
            :alt="artwork.title"
            class="artwork-list-image"
            :class="listImageClasses"
            loading="lazy"
          />
        </div>

        <!-- Content -->
        <div class="artwork-list-content" :class="listContentClasses">
          <div class="artwork-list-header">
            <h3 class="artwork-title" :class="titleClasses">
              {{ artwork.title }}
            </h3>
            
            <div v-if="artwork.price" class="artwork-list-price">
              <PriceDisplay
                :price="artwork.price"
                :original-price="artwork.originalPrice"
                :currency="'¥'"
                :size="size === 'lg' ? 'md' : 'sm'"
                :show-discount="!!artwork.originalPrice"
              />
            </div>
          </div>

          <!-- Artist Info -->
          <div class="artwork-artist" :class="artistClasses">
            <img
              :src="artwork.artist.avatar || '/placeholder-avatar.jpg'"
              :alt="artwork.artist.name"
              class="artwork-artist-avatar"
              :class="avatarClasses"
            />
            <span class="artwork-artist-name" :class="artistNameClasses">
              {{ artwork.artist.name }}
            </span>
            <Icon
              v-if="artwork.artist.isVerified"
              name="heroicons:check-badge"
              class="artwork-verified-badge"
              :class="verifiedBadgeClasses"
            />
          </div>

          <!-- Tags -->
          <div v-if="artwork.tags && artwork.tags.length > 0" class="artwork-list-tags">
            <span
              v-for="tag in artwork.tags.slice(0, 5)"
              :key="tag"
              class="artwork-list-tag"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Stats and Actions -->
          <div class="artwork-list-footer">
            <div class="artwork-stats" :class="statsClasses">
              <div class="artwork-stat">
                <Icon name="heroicons:heart" class="artwork-stat-icon" />
                <span>{{ formatNumber(artwork.likes) }}</span>
              </div>
              <div class="artwork-stat">
                <Icon name="heroicons:eye" class="artwork-stat-icon" />
                <span>{{ formatNumber(artwork.views || 0) }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div v-if="showActions" class="artwork-list-actions">
              <button
                @click.prevent="handleLike"
                class="artwork-list-action-btn"
                :class="{ 'artwork-list-action-btn-liked': artwork.isLiked }"
                :aria-label="artwork.isLiked ? '取消点赞' : '点赞'"
              >
                <Icon
                  :name="artwork.isLiked ? 'heroicons:heart-solid' : 'heroicons:heart'"
                  class="w-4 h-4"
                />
              </button>
              
              <button
                v-if="onAddToCart"
                @click.prevent="handleAddToCart"
                class="artwork-list-action-btn"
                :aria-label="'添加到购物车'"
              >
                <Icon name="heroicons:shopping-cart" class="w-4 h-4" />
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

export interface ArtworkCardProps {
  artwork: {
    id: string
    title: string
    artist: {
      id: string
      name: string
      avatar: string
      isVerified?: boolean
    }
    image: string
    price?: number
    originalPrice?: number
    tags?: string[]
    likes: number
    views?: number
    isLiked: boolean
    createdAt?: Date
  }
  variant?: 'grid' | 'list' | 'featured'
  size?: ComponentSize
  showActions?: boolean
  onLike?: (artworkId: string) => void
  onAddToCart?: (artworkId: string) => void
  onQuickView?: (artworkId: string) => void
}

const props = withDefaults(defineProps<ArtworkCardProps>(), {
  variant: 'grid',
  size: 'md',
  showActions: true,
})

const emit = defineEmits<{
  like: [artworkId: string]
  addToCart: [artworkId: string]
  quickView: [artworkId: string]
}>()

// Computed classes
const cardClasses = computed(() => [
  'artwork-card-base',
  `artwork-card-${props.variant}`,
  `artwork-card-${props.size}`,
])

const linkClasses = computed(() => [
  'artwork-link-base',
  `artwork-link-${props.variant}`,
  `artwork-link-${props.size}`,
])

const imageContainerClasses = computed(() => [
  'artwork-image-container-base',
  `artwork-image-container-${props.size}`,
])

const imageClasses = computed(() => [
  'artwork-image-base',
  `artwork-image-${props.variant}`,
])

const overlayClasses = computed(() => [
  'artwork-overlay-base',
  `artwork-overlay-${props.variant}`,
])

const overlayContentClasses = computed(() => [
  'artwork-overlay-content-base',
  `artwork-overlay-content-${props.size}`,
])

const actionsClasses = computed(() => [
  'artwork-actions-base',
  `artwork-actions-${props.size}`,
])

const likeButtonClasses = computed(() => [
  'artwork-like-btn',
  { 'artwork-like-btn-liked': props.artwork.isLiked },
])

const likeIconClasses = computed(() => [
  'w-5 h-5 transition-colors',
  props.artwork.isLiked ? 'text-red-500' : 'text-gray-700',
])

const priceBadgeClasses = computed(() => [
  'artwork-price-badge-base',
  `artwork-price-badge-${props.size}`,
])

const contentClasses = computed(() => [
  'artwork-content-base',
  `artwork-content-${props.variant}`,
  `artwork-content-${props.size}`,
])

const titleClasses = computed(() => [
  'artwork-title-base',
  `artwork-title-${props.variant}`,
  `artwork-title-${props.size}`,
])

const artistClasses = computed(() => [
  'artwork-artist-base',
  `artwork-artist-${props.size}`,
])

const avatarClasses = computed(() => [
  'artwork-avatar-base',
  `artwork-avatar-${props.size}`,
])

const artistNameClasses = computed(() => [
  'artwork-artist-name-base',
  `artwork-artist-name-${props.size}`,
])

const verifiedBadgeClasses = computed(() => [
  'artwork-verified-base',
  `artwork-verified-${props.size}`,
])

const statsClasses = computed(() => [
  'artwork-stats-base',
  `artwork-stats-${props.variant}`,
  `artwork-stats-${props.size}`,
])

const priceClasses = computed(() => [
  'artwork-price-base',
  `artwork-price-${props.size}`,
])

// List variant specific classes
const listImageContainerClasses = computed(() => [
  'artwork-list-image-container-base',
  `artwork-list-image-container-${props.size}`,
])

const listImageClasses = computed(() => [
  'artwork-list-image-base',
  `artwork-list-image-${props.size}`,
])

const listContentClasses = computed(() => [
  'artwork-list-content-base',
  `artwork-list-content-${props.size}`,
])

// Event handlers
const handleLike = () => {
  if (props.onLike) {
    props.onLike(props.artwork.id)
  }
  emit('like', props.artwork.id)
}

const handleAddToCart = () => {
  if (props.onAddToCart) {
    props.onAddToCart(props.artwork.id)
  }
  emit('addToCart', props.artwork.id)
}

const handleQuickView = () => {
  if (props.onQuickView) {
    props.onQuickView(props.artwork.id)
  }
  emit('quickView', props.artwork.id)
}

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

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '1天前'
  } else if (diffDays < 30) {
    return `${diffDays}天前`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}个月前`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}年前`
  }
}
</script>

<style scoped>
/* Base Card Styles */
.artwork-card-base {
  @apply w-full;
}

.artwork-card-grid,
.artwork-card-featured {
  @apply block;
}

.artwork-card-list {
  @apply block;
}

/* Link Styles */
.artwork-link-base {
  @apply group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl 
         transition-all duration-300 border border-gray-100 hover:border-gray-200;
}

.artwork-link-grid,
.artwork-link-featured {
  @apply flex flex-col;
}

.artwork-card-list {
  @apply flex gap-4;
}

/* Image Container */
.artwork-image-container-base {
  @apply relative overflow-hidden bg-gray-100;
}

.artwork-image-container-sm {
  @apply aspect-[3/4];
}

.artwork-image-container-md {
  @apply aspect-[3/4];
}

.artwork-image-container-lg {
  @apply aspect-[4/5];
}

/* Image */
.artwork-image-base {
  @apply w-full h-full object-cover transition-transform duration-500;
}

.artwork-image-grid {
  @apply group-hover:scale-110;
}

.artwork-image-featured {
  @apply group-hover:scale-105;
}

/* Overlay */
.artwork-overlay-base {
  @apply absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
         opacity-0 group-hover:opacity-100 transition-opacity duration-300;
}

.artwork-overlay-content-base {
  @apply absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 
         group-hover:translate-y-0 transition-transform duration-300;
}

.artwork-overlay-content-sm {
  @apply p-3;
}

.artwork-overlay-content-lg {
  @apply p-5;
}

/* Tags */
.artwork-tags {
  @apply flex flex-wrap gap-1;
}

.artwork-tag {
  @apply px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-medium;
}

/* Actions */
.artwork-actions-base {
  @apply absolute top-3 right-3 flex gap-2;
}

.artwork-actions-sm {
  @apply top-2 right-2 gap-1;
}

.artwork-actions-lg {
  @apply top-4 right-4 gap-3;
}

.artwork-action-btn {
  @apply p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white 
         transition-colors shadow-sm hover:shadow-md;
}

.artwork-like-btn-liked {
  @apply bg-red-50 hover:bg-red-100;
}

/* Price Badge */
.artwork-price-badge-base {
  @apply absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm;
}

.artwork-price-badge-sm {
  @apply bottom-2 left-2 px-2 py-1;
}

.artwork-price-badge-lg {
  @apply bottom-4 left-4 px-4 py-3;
}

/* Content */
.artwork-content-base {
  @apply p-4;
}

.artwork-content-grid {
  @apply flex-1;
}

.artwork-content-featured {
  @apply flex-1;
}

.artwork-content-sm {
  @apply p-3;
}

.artwork-content-lg {
  @apply p-5;
}

/* Title */
.artwork-title-base {
  @apply font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 
         transition-colors;
}

.artwork-title-grid {
  @apply text-base;
}

.artwork-title-featured {
  @apply text-lg;
}

.artwork-title-list {
  @apply text-base;
}

.artwork-title-sm {
  @apply text-sm mb-1;
}

.artwork-title-lg {
  @apply text-xl mb-3;
}

/* Artist */
.artwork-artist-base {
  @apply flex items-center gap-2 mb-3;
}

.artwork-artist-sm {
  @apply gap-1.5 mb-2;
}

.artwork-artist-lg {
  @apply gap-3 mb-4;
}

.artwork-avatar-base {
  @apply rounded-full object-cover;
}

.artwork-avatar-sm {
  @apply w-5 h-5;
}

.artwork-avatar-md {
  @apply w-6 h-6;
}

.artwork-avatar-lg {
  @apply w-8 h-8;
}

.artwork-artist-name-base {
  @apply text-gray-600 line-clamp-1 flex-1;
}

.artwork-artist-name-sm {
  @apply text-xs;
}

.artwork-artist-name-md {
  @apply text-sm;
}

.artwork-artist-name-lg {
  @apply text-base;
}

.artwork-verified-base {
  @apply text-blue-500 shrink-0;
}

.artwork-verified-sm {
  @apply w-4 h-4;
}

.artwork-verified-md {
  @apply w-5 h-5;
}

.artwork-verified-lg {
  @apply w-6 h-6;
}

/* Stats */
.artwork-stats-base {
  @apply flex items-center gap-4 text-gray-500;
}

.artwork-stats-sm {
  @apply gap-3 text-xs;
}

.artwork-stats-lg {
  @apply gap-5 text-base;
}

.artwork-stat {
  @apply flex items-center gap-1;
}

.artwork-stat-icon {
  @apply w-4 h-4;
}

.artwork-date {
  @apply text-xs text-gray-400 ml-auto;
}

/* Price */
.artwork-price-base {
  @apply mt-3 pt-3 border-t border-gray-100;
}

.artwork-price-sm {
  @apply mt-2 pt-2;
}

.artwork-price-lg {
  @apply mt-4 pt-4;
}

/* List Variant Specific Styles */
.artwork-list-image-container-base {
  @apply relative overflow-hidden bg-gray-100 rounded-lg shrink-0;
}

.artwork-list-image-container-sm {
  @apply w-20 h-20;
}

.artwork-list-image-container-md {
  @apply w-24 h-24;
}

.artwork-list-image-container-lg {
  @apply w-32 h-32;
}

.artwork-list-image-base {
  @apply w-full h-full object-cover group-hover:scale-110 transition-transform duration-300;
}

.artwork-list-content-base {
  @apply flex-1 min-w-0;
}

.artwork-list-header {
  @apply flex items-start justify-between gap-4 mb-2;
}

.artwork-list-price {
  @apply shrink-0;
}

.artwork-list-tags {
  @apply flex flex-wrap gap-1 mb-3;
}

.artwork-list-tag {
  @apply px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs;
}

.artwork-list-footer {
  @apply flex items-center justify-between;
}

.artwork-list-actions {
  @apply flex items-center gap-2;
}

.artwork-list-action-btn {
  @apply p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg 
         transition-colors;
}

.artwork-list-action-btn-liked {
  @apply text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .artwork-card-list .artwork-link-base {
    @apply flex-col;
  }
  
  .artwork-list-image-container-base {
    @apply w-full aspect-[3/2];
  }
  
  .artwork-list-header {
    @apply flex-col items-start gap-2;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .artwork-link-base {
    @apply border-2;
  }
  
  .artwork-action-btn {
    @apply border border-gray-300;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .artwork-image-base,
  .artwork-link-base,
  .artwork-overlay-base,
  .artwork-overlay-content-base {
    @apply transition-none;
  }
}
</style>