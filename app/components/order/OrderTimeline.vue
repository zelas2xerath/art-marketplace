<!--
  OrderTimeline Component
  订单时间线组件
  
  Displays the order history and status changes in a timeline format.
  
  Features:
  - Chronological event display
  - Status indicators
  - Timestamps
  - Event descriptions
  - Responsive design
  - Accessibility support
-->

<template>
  <div class="order-timeline" :class="containerClasses">
    <div
      v-for="(event, index) in events"
      :key="event.id"
      class="timeline-item"
      :class="getItemClasses(event, index)"
    >
      <!-- Connector Line -->
      <div v-if="index < events.length - 1" class="timeline-connector" />
      
      <!-- Icon -->
      <div class="timeline-icon-container" :class="getIconContainerClasses(event)">
        <Icon :name="getEventIcon(event)" class="timeline-icon" />
      </div>
      
      <!-- Content -->
      <div class="timeline-content">
        <div class="timeline-header">
          <h4 class="timeline-title">{{ event.title }}</h4>
          <time class="timeline-time" :datetime="event.timestamp.toISOString()">
            {{ formatTime(event.timestamp) }}
          </time>
        </div>
        
        <p v-if="event.description" class="timeline-description">
          {{ event.description }}
        </p>
        
        <!-- Metadata -->
        <div v-if="event.metadata" class="timeline-metadata">
          <span
            v-for="(value, key) in event.metadata"
            :key="key"
            class="timeline-meta-item"
          >
            <span class="timeline-meta-label">{{ key }}:</span>
            <span class="timeline-meta-value">{{ value }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatusType } from './OrderStatus.vue'

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp: Date
  status: OrderStatusType
  metadata?: Record<string, string>
}

export interface OrderTimelineProps {
  events: TimelineEvent[]
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<OrderTimelineProps>(), {
  size: 'md',
})

// Computed
const containerClasses = computed(() => [
  'order-timeline-base',
  `order-timeline-${props.size}`,
])

const getItemClasses = (event: TimelineEvent, index: number) => [
  'timeline-item-base',
  `timeline-item-${props.size}`,
  {
    'timeline-item-last': index === props.events.length - 1,
  },
]

const getIconContainerClasses = (event: TimelineEvent) => {
  const colorMap: Record<OrderStatusType, string> = {
    'pending': 'gray',
    'confirmed': 'blue',
    'in-progress': 'purple',
    'completed': 'green',
    'cancelled': 'red',
    'refunded': 'orange',
  }
  
  return [
    'timeline-icon-container-base',
    `timeline-icon-container-${colorMap[event.status]}`,
  ]
}

const getEventIcon = (event: TimelineEvent): string => {
  const iconMap: Record<OrderStatusType, string> = {
    'pending': 'heroicons:clock',
    'confirmed': 'heroicons:check-circle',
    'in-progress': 'heroicons:arrow-path',
    'completed': 'heroicons:check-badge',
    'cancelled': 'heroicons:x-circle',
    'refunded': 'heroicons:arrow-uturn-left',
  }
  
  return iconMap[event.status]
}

const formatTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return '刚刚'
  if (diffMins < 60) return `${diffMins}分钟前`
  if (diffHours < 24) return `${diffHours}小时前`
  if (diffDays < 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>

/* Container */
.order-timeline-base {
  @apply relative;
}

/* Timeline Item */
.timeline-item-base {
  @apply relative flex gap-4 pb-8;
}

.timeline-item-last {
  @apply pb-0;
}

.timeline-item-sm {
  @apply gap-3 pb-6;
}

.timeline-item-md {
  @apply gap-4 pb-8;
}

.timeline-item-lg {
  @apply gap-5 pb-10;
}

/* Connector Line */
.timeline-connector {
  @apply absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200;
}

.timeline-item-sm .timeline-connector {
  @apply left-3 top-8;
}

.timeline-item-lg .timeline-connector {
  @apply left-5 top-12;
}

/* Icon Container */
.timeline-icon-container-base {
  @apply w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10;
}

.timeline-item-sm .timeline-icon-container-base {
  @apply w-6 h-6;
}

.timeline-item-lg .timeline-icon-container-base {
  @apply w-10 h-10;
}

/* Icon Container Colors */
.timeline-icon-container-gray {
  @apply bg-gray-100 text-gray-600;
}

.timeline-icon-container-blue {
  @apply bg-blue-100 text-blue-600;
}

.timeline-icon-container-purple {
  @apply bg-purple-100 text-purple-600;
}

.timeline-icon-container-green {
  @apply bg-green-100 text-green-600;
}

.timeline-icon-container-red {
  @apply bg-red-100 text-red-600;
}

.timeline-icon-container-orange {
  @apply bg-orange-100 text-orange-600;
}

/* Icon */
.timeline-icon {
  @apply w-4 h-4;
}

.timeline-item-sm .timeline-icon {
  @apply w-3.5 h-3.5;
}

.timeline-item-lg .timeline-icon {
  @apply w-5 h-5;
}

/* Content */
.timeline-content {
  @apply flex-1 min-w-0;
}

/* Header */
.timeline-header {
  @apply flex items-start justify-between gap-4 mb-1;
}

/* Title */
.timeline-title {
  @apply font-medium text-gray-900;
}

.timeline-item-sm .timeline-title {
  @apply text-sm;
}

.timeline-item-md .timeline-title {
  @apply text-base;
}

.timeline-item-lg .timeline-title {
  @apply text-lg;
}

/* Time */
.timeline-time {
  @apply text-xs text-gray-500 shrink-0;
}

.timeline-item-lg .timeline-time {
  @apply text-sm;
}

/* Description */
.timeline-description {
  @apply text-sm text-gray-600 mb-2;
}

.timeline-item-sm .timeline-description {
  @apply text-xs;
}

.timeline-item-lg .timeline-description {
  @apply text-base;
}

/* Metadata */
.timeline-metadata {
  @apply flex flex-wrap gap-3 text-xs text-gray-500;
}

.timeline-meta-item {
  @apply flex items-center gap-1;
}

.timeline-meta-label {
  @apply font-medium;
}

.timeline-meta-value {
  @apply text-gray-700;
}

/* Responsive */
@media (max-width: 640px) {
  .timeline-header {
    @apply flex-col gap-1;
  }
  
  .timeline-time {
    @apply self-start;
  }
}
</style>
