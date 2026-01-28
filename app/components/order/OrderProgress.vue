<!--
  OrderProgress Component
  订单进度组件
  
  Displays order progress with step indicators.
  
  Features:
  - Multi-step progress
  - Current step highlighting
  - Completed step indicators
  - Step descriptions
  - Responsive design
  - Accessibility support
-->

<template>
  <div class="order-progress" :class="containerClasses">
    <div class="progress-steps">
      <div
        v-for="(step, index) in steps"
        :key="step.id"
        class="progress-step"
        :class="getStepClasses(step, index)"
      >
        <!-- Connector Line -->
        <div v-if="index < steps.length - 1" class="progress-connector">
          <div
            class="progress-connector-fill"
            :class="{ 'progress-connector-completed': isStepCompleted(index) }"
          />
        </div>
        
        <!-- Step Indicator -->
        <div class="progress-indicator" :class="getIndicatorClasses(step, index)">
          <Icon
            v-if="isStepCompleted(index)"
            name="heroicons:check"
            class="progress-check-icon"
          />
          <span v-else class="progress-step-number">{{ index + 1 }}</span>
        </div>
        
        <!-- Step Content -->
        <div class="progress-content">
          <div class="progress-label">{{ step.label }}</div>
          <div v-if="step.description" class="progress-description">
            {{ step.description }}
          </div>
          <div v-if="step.timestamp && isStepCompleted(index)" class="progress-timestamp">
            {{ formatTimestamp(step.timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ProgressStep {
  id: string
  label: string
  description?: string
  timestamp?: Date
}

export interface OrderProgressProps {
  steps: ProgressStep[]
  currentStep: number // 0-based index
  size?: 'sm' | 'md' | 'lg'
  orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<OrderProgressProps>(), {
  size: 'md',
  orientation: 'horizontal',
})

// Computed
const containerClasses = computed(() => [
  'order-progress-base',
  `order-progress-${props.size}`,
  `order-progress-${props.orientation}`,
])

const getStepClasses = (step: ProgressStep, index: number) => [
  'progress-step-base',
  `progress-step-${props.orientation}`,
  {
    'progress-step-completed': isStepCompleted(index),
    'progress-step-current': index === props.currentStep,
    'progress-step-pending': index > props.currentStep,
  },
]

const getIndicatorClasses = (step: ProgressStep, index: number) => [
  'progress-indicator-base',
  `progress-indicator-${props.size}`,
  {
    'progress-indicator-completed': isStepCompleted(index),
    'progress-indicator-current': index === props.currentStep,
    'progress-indicator-pending': index > props.currentStep,
  },
]

const isStepCompleted = (index: number): boolean => {
  return index < props.currentStep
}

const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>

/* Container */
.order-progress-base {
  @apply w-full;
}

/* Steps Container */
.progress-steps {
  @apply flex;
}

.order-progress-horizontal .progress-steps {
  @apply flex-row items-start;
}

.order-progress-vertical .progress-steps {
  @apply flex-col;
}

/* Step */
.progress-step-base {
  @apply relative flex;
}

.progress-step-horizontal {
  @apply flex-col items-center flex-1;
}

.progress-step-vertical {
  @apply flex-row gap-4 pb-8 last:pb-0;
}

/* Connector */
.progress-connector {
  @apply absolute bg-gray-200;
}

.progress-step-horizontal .progress-connector {
  @apply left-1/2 top-4 h-0.5 w-full;
}

.progress-step-vertical .progress-connector {
  @apply left-4 top-10 w-0.5 bottom-0;
}

.progress-connector-fill {
  @apply h-full w-full bg-gray-200 transition-colors duration-300;
}

.progress-connector-completed {
  @apply bg-primary-600;
}

/* Indicator */
.progress-indicator-base {
  @apply relative z-10 rounded-full flex items-center justify-center 
         font-medium transition-all duration-300 shrink-0;
}

.progress-indicator-sm {
  @apply w-6 h-6 text-xs;
}

.progress-indicator-md {
  @apply w-8 h-8 text-sm;
}

.progress-indicator-lg {
  @apply w-10 h-10 text-base;
}

.progress-indicator-completed {
  @apply bg-primary-600 text-white;
}

.progress-indicator-current {
  @apply bg-primary-600 text-white ring-4 ring-primary-100;
}

.progress-indicator-pending {
  @apply bg-gray-200 text-gray-500;
}

/* Check Icon */
.progress-check-icon {
  @apply w-4 h-4;
}

.progress-indicator-sm .progress-check-icon {
  @apply w-3 h-3;
}

.progress-indicator-lg .progress-check-icon {
  @apply w-5 h-5;
}

/* Step Number */
.progress-step-number {
  @apply font-semibold;
}

/* Content */
.progress-content {
  @apply text-center;
}

.progress-step-horizontal .progress-content {
  @apply mt-3;
}

.progress-step-vertical .progress-content {
  @apply text-left flex-1;
}

/* Label */
.progress-label {
  @apply font-medium text-gray-900;
}

.order-progress-sm .progress-label {
  @apply text-xs;
}

.order-progress-md .progress-label {
  @apply text-sm;
}

.order-progress-lg .progress-label {
  @apply text-base;
}

.progress-step-pending .progress-label {
  @apply text-gray-500;
}

/* Description */
.progress-description {
  @apply mt-1 text-xs text-gray-600;
}

.order-progress-lg .progress-description {
  @apply text-sm;
}

.progress-step-pending .progress-description {
  @apply text-gray-400;
}

/* Timestamp */
.progress-timestamp {
  @apply mt-1 text-xs text-gray-500;
}

/* Responsive */
@media (max-width: 640px) {
  .order-progress-horizontal {
    @apply overflow-x-auto;
  }
  
  .order-progress-horizontal .progress-steps {
    @apply min-w-max px-4;
  }
  
  .progress-step-horizontal {
    @apply min-w-25;
  }
}
</style>
