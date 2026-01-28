<!--
  OrderStatus Component
  订单状态组件
  
  Displays the current status of an order with visual indicators.
  
  Features:
  - Multiple status types
  - Color-coded indicators
  - Icon support
  - Size variants
  - Accessibility support
-->

<template>
  <div class="order-status" :class="containerClasses">
    <div class="order-status-indicator" :class="indicatorClasses">
      <Icon :name="statusIcon" :class="iconClasses" />
    </div>
    
    <div class="order-status-content">
      <span class="order-status-label" :class="labelClasses">
        {{ statusLabel }}
      </span>
      <span v-if="description" class="order-status-description" :class="descriptionClasses">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type OrderStatusType = 
  | 'pending'      // 待确认
  | 'confirmed'    // 已确认
  | 'in-progress'  // 进行中
  | 'completed'    // 已完成
  | 'cancelled'    // 已取消
  | 'refunded'     // 已退款

export interface OrderStatusProps {
  status: OrderStatusType
  description?: string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<OrderStatusProps>(), {
  size: 'md',
  showIcon: true,
})

// Computed
const statusConfig = computed(() => {
  const configs: Record<OrderStatusType, { label: string; icon: string; color: string }> = {
    'pending': {
      label: '待确认',
      icon: 'heroicons:clock',
      color: 'gray',
    },
    'confirmed': {
      label: '已确认',
      icon: 'heroicons:check-circle',
      color: 'blue',
    },
    'in-progress': {
      label: '进行中',
      icon: 'heroicons:arrow-path',
      color: 'purple',
    },
    'completed': {
      label: '已完成',
      icon: 'heroicons:check-badge',
      color: 'green',
    },
    'cancelled': {
      label: '已取消',
      icon: 'heroicons:x-circle',
      color: 'red',
    },
    'refunded': {
      label: '已退款',
      icon: 'heroicons:arrow-uturn-left',
      color: 'orange',
    },
  }
  
  return configs[props.status]
})

const statusLabel = computed(() => statusConfig.value.label)
const statusIcon = computed(() => statusConfig.value.icon)
const statusColor = computed(() => statusConfig.value.color)

const containerClasses = computed(() => [
  'order-status-base',
  `order-status-${props.size}`,
])

const indicatorClasses = computed(() => [
  'order-status-indicator-base',
  `order-status-indicator-${statusColor.value}`,
  `order-status-indicator-${props.size}`,
])

const iconClasses = computed(() => [
  'order-status-icon',
  `order-status-icon-${props.size}`,
])

const labelClasses = computed(() => [
  'order-status-label-base',
  `order-status-label-${statusColor.value}`,
  `order-status-label-${props.size}`,
])

const descriptionClasses = computed(() => [
  'order-status-description-base',
  `order-status-description-${props.size}`,
])
</script>

<style scoped>

/* Container */
.order-status-base {
  @apply inline-flex items-center gap-2;
}

.order-status-sm {
  @apply gap-1.5;
}

.order-status-md {
  @apply gap-2;
}

.order-status-lg {
  @apply gap-3;
}

/* Indicator */
.order-status-indicator-base {
  @apply rounded-full flex items-center justify-center shrink-0;
}

.order-status-indicator-sm {
  @apply w-6 h-6;
}

.order-status-indicator-md {
  @apply w-8 h-8;
}

.order-status-indicator-lg {
  @apply w-10 h-10;
}

/* Indicator Colors */
.order-status-indicator-gray {
  @apply bg-gray-100 text-gray-600;
}

.order-status-indicator-blue {
  @apply bg-blue-100 text-blue-600;
}

.order-status-indicator-purple {
  @apply bg-purple-100 text-purple-600;
}

.order-status-indicator-green {
  @apply bg-green-100 text-green-600;
}

.order-status-indicator-red {
  @apply bg-red-100 text-red-600;
}

.order-status-indicator-orange {
  @apply bg-orange-100 text-orange-600;
}

/* Icon */
.order-status-icon {
  @apply shrink-0;
}

.order-status-icon-sm {
  @apply w-3.5 h-3.5;
}

.order-status-icon-md {
  @apply w-4 h-4;
}

.order-status-icon-lg {
  @apply w-5 h-5;
}

/* Content */
.order-status-content {
  @apply flex flex-col;
}

/* Label */
.order-status-label-base {
  @apply font-medium;
}

.order-status-label-sm {
  @apply text-xs;
}

.order-status-label-md {
  @apply text-sm;
}

.order-status-label-lg {
  @apply text-base;
}

/* Label Colors */
.order-status-label-gray {
  @apply text-gray-700;
}

.order-status-label-blue {
  @apply text-blue-700;
}

.order-status-label-purple {
  @apply text-purple-700;
}

.order-status-label-green {
  @apply text-green-700;
}

.order-status-label-red {
  @apply text-red-700;
}

.order-status-label-orange {
  @apply text-orange-700;
}

/* Description */
.order-status-description-base {
  @apply text-gray-500;
}

.order-status-description-sm {
  @apply text-xs;
}

.order-status-description-md {
  @apply text-xs;
}

.order-status-description-lg {
  @apply text-sm;
}
</style>
