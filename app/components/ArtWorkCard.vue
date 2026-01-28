<!--
  ArtworkCard Component
  作品卡片组件
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
              :currency= "'CNY'"
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
              :currency="'CNY'"
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
                :currency="'CNY'"
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
import PriceDisplay from "~/components/ui/PriceDisplay.vue";

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
  width: 100%;
}

.artwork-card-grid,
.artwork-card-featured {
  display: block;
}

.artwork-card-list {
  display: block;
}

/* Link Styles */
.artwork-link-base {
  display: block;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgb(243 244 246);
}

.artwork-link-base:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-color: rgb(229 231 235);
}

.artwork-link-grid,
.artwork-link-featured {
  display: flex;
  flex-direction: column;
}

.artwork-card-list {
  display: flex;
  gap: 1rem;
}

/* Image Container */
.artwork-image-container-base {
  position: relative;
  overflow: hidden;
  background-color: rgb(243 244 246);
}

.artwork-image-container-sm {
  aspect-ratio: 3/4;
}

.artwork-image-container-md {
  aspect-ratio: 3/4;
}

.artwork-image-container-lg {
  aspect-ratio: 4/5;
}

/* Image */
.artwork-image-base {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.artwork-link-base:hover .artwork-image-grid {
  transform: scale(1.1);
}

.artwork-link-base:hover .artwork-image-featured {
  transform: scale(1.05);
}

/* Overlay */
.artwork-overlay-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 0.6), transparent, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-link-base:hover .artwork-overlay-base {
  opacity: 1;
}

.artwork-overlay-content-base {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
  transform: translateY(0.5rem);
  transition: transform 0.3s ease;
}

.artwork-link-base:hover .artwork-overlay-content-base {
  transform: translateY(0);
}

.artwork-overlay-content-sm {
  padding: 0.75rem;
}

.artwork-overlay-content-lg {
  padding: 1.25rem;
}

/* Base Card Styles */
.artwork-card-base {
  width: 100%;
}

.artwork-card-grid,
.artwork-card-featured {
  display: block;
}

.artwork-card-list {
  display: block;
}

/* Link Styles */
.artwork-link-base {
  display: block;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgb(243 244 246);
}

.artwork-link-base:hover {
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  border-color: rgb(229 231 235);
}

.artwork-link-grid,
.artwork-link-featured {
  display: flex;
  flex-direction: column;
}

.artwork-card-list {
  display: flex;
  gap: 1rem;
}

/* Image Container */
.artwork-image-container-base {
  position: relative;
  overflow: hidden;
  background-color: rgb(243 244 246);
}

.artwork-image-container-sm {
  aspect-ratio: 3/4;
}

.artwork-image-container-md {
  aspect-ratio: 3/4;
}

.artwork-image-container-lg {
  aspect-ratio: 4/5;
}

/* Image */
.artwork-image-base {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.artwork-link-base:hover .artwork-image-grid {
  transform: scale(1.1);
}

.artwork-link-base:hover .artwork-image-featured {
  transform: scale(1.05);
}

/* Overlay */
.artwork-overlay-base {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgb(0 0 0 / 0.6), transparent, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.artwork-link-base:hover .artwork-overlay-base {
  opacity: 1;
}

.artwork-overlay-content-base {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
  transform: translateY(0.5rem);
  transition: transform 0.3s ease;
}

.artwork-link-base:hover .artwork-overlay-content-base {
  transform: translateY(0);
}

.artwork-overlay-content-sm {
  padding: 0.75rem;
}

.artwork-overlay-content-lg {
  padding: 1.25rem;
}

/* Tags */
.artwork-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.artwork-tag {
  padding: 0.25rem 0.5rem;
  background-color: rgb(255 255 255 / 0.2);
  backdrop-filter: blur(4px);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Actions */
.artwork-actions-base {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.artwork-actions-sm {
  top: 0.5rem;
  right: 0.5rem;
  gap: 0.25rem;
}

.artwork-actions-lg {
  top: 1rem;
  right: 1rem;
  gap: 0.75rem;
}

.artwork-action-btn {
  padding: 0.5rem;
  background-color: rgb(255 255 255 / 0.9);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.artwork-action-btn:hover {
  background-color: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.artwork-like-btn-liked {
  background-color: rgb(254 242 242);
}

.artwork-like-btn-liked:hover {
  background-color: rgb(254 226 226);
}

/* Price Badge */
.artwork-price-badge-base {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background-color: rgb(255 255 255 / 0.95);
  backdrop-filter: blur(4px);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

.artwork-price-badge-sm {
  bottom: 0.5rem;
  left: 0.5rem;
  padding: 0.25rem 0.5rem;
}

.artwork-price-badge-lg {
  bottom: 1rem;
  left: 1rem;
  padding: 0.75rem 1rem;
}

/* Content */
.artwork-content-base {
  padding: 1rem;
}

.artwork-content-grid {
  flex: 1;
}

.artwork-content-featured {
  flex: 1;
}

.artwork-content-sm {
  padding: 0.75rem;
}

.artwork-content-lg {
  padding: 1.25rem;
}

/* Title */
.artwork-title-base {
  font-weight: 600;
  color: rgb(17 24 39);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.artwork-link-base:hover .artwork-title-base {
  color: rgb(147 51 234);
}

.artwork-title-grid {
  font-size: 1rem;
}

.artwork-title-featured {
  font-size: 1.125rem;
}

.artwork-title-list {
  font-size: 1rem;
}

.artwork-title-sm {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.artwork-title-lg {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

/* Artist */
.artwork-artist-base {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.artwork-artist-sm {
  gap: 0.375rem;
  margin-bottom: 0.5rem;
}

.artwork-artist-lg {
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.artwork-avatar-base {
  border-radius: 50%;
  object-fit: cover;
}

.artwork-avatar-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.artwork-avatar-md {
  width: 1.5rem;
  height: 1.5rem;
}

.artwork-avatar-lg {
  width: 2rem;
  height: 2rem;
}

.artwork-artist-name-base {
  color: rgb(75 85 99);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.artwork-artist-name-sm {
  font-size: 0.75rem;
}

.artwork-artist-name-md {
  font-size: 0.875rem;
}

.artwork-artist-name-lg {
  font-size: 1rem;
}

.artwork-verified-base {
  color: rgb(59 130 246);
  flex-shrink: 0;
}

.artwork-verified-sm {
  width: 1rem;
  height: 1rem;
}

.artwork-verified-md {
  width: 1.25rem;
  height: 1.25rem;
}

.artwork-verified-lg {
  width: 1.5rem;
  height: 1.5rem;
}

/* Stats */
.artwork-stats-base {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgb(107 114 128);
}

.artwork-stats-sm {
  gap: 0.75rem;
  font-size: 0.75rem;
}

.artwork-stats-lg {
  gap: 1.25rem;
  font-size: 1rem;
}

.artwork-stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.artwork-stat-icon {
  width: 1rem;
  height: 1rem;
}

.artwork-date {
  font-size: 0.75rem;
  color: rgb(156 163 175);
  margin-left: auto;
}

/* Price */
.artwork-price-base {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgb(243 244 246);
}

.artwork-price-sm {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}

.artwork-price-lg {
  margin-top: 1rem;
  padding-top: 1rem;
}

/* List Variant Specific Styles */
.artwork-list-image-container-base {
  position: relative;
  overflow: hidden;
  background-color: rgb(243 244 246);
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.artwork-list-image-container-sm {
  width: 5rem;
  height: 5rem;
}

.artwork-list-image-container-md {
  width: 6rem;
  height: 6rem;
}

.artwork-list-image-container-lg {
  width: 8rem;
  height: 8rem;
}

.artwork-list-image-base {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.artwork-link-base:hover .artwork-list-image-base {
  transform: scale(1.1);
}

.artwork-list-content-base {
  flex: 1;
  min-width: 0;
}

.artwork-list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.artwork-list-price {
  flex-shrink: 0;
}

.artwork-list-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-bottom: 0.75rem;
}

.artwork-list-tag {
  padding: 0.25rem 0.5rem;
  background-color: rgb(243 244 246);
  color: rgb(75 85 99);
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.artwork-list-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.artwork-list-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.artwork-list-action-btn {
  padding: 0.5rem;
  color: rgb(156 163 175);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.artwork-list-action-btn:hover {
  color: rgb(75 85 99);
  background-color: rgb(243 244 246);
}

.artwork-list-action-btn-liked {
  color: rgb(239 68 68);
  background-color: rgb(254 242 242);
}

.artwork-list-action-btn-liked:hover {
  color: rgb(220 38 38);
  background-color: rgb(254 226 226);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .artwork-card-list .artwork-link-base {
    flex-direction: column;
  }
  
  .artwork-list-image-container-base {
    width: 100%;
    aspect-ratio: 3/2;
  }
  
  .artwork-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* High contrast mode */
@media (prefers-contrast: more) {
  .artwork-link-base {
    border-width: 2px;
  }
  
  .artwork-action-btn {
    border: 1px solid rgb(209 213 219);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .artwork-image-base,
  .artwork-link-base,
  .artwork-overlay-base,
  .artwork-overlay-content-base {
    transition: none;
  }
}
</style>