<!--
  Button Component
  基础按钮组件
  
  This component provides a flexible button implementation with multiple variants,
  sizes, role-based theming, and comprehensive state management.
  
  Features:
  - Multiple variants (primary, secondary, outline, ghost, danger)
  - Multiple sizes (xs, sm, md, lg, xl)
  - Role-based theming (client, artist, admin)
  - Loading and disabled states
  - Icon support with positioning
  - Full width option
  - Accessibility support
-->

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedBy"
    @click="handleClick"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <!-- Loading spinner -->
    <div
      v-if="loading"
      class="animate-spin rounded-full border-2 border-current border-t-transparent"
      :class="loadingSpinnerSize"
      aria-hidden="true"
    />
    
    <!-- Left icon -->
    <component
      v-if="icon && iconPosition === 'left' && !loading"
      :is="icon"
      :class="iconClasses"
      aria-hidden="true"
    />
    
    <!-- Button content -->
    <span
      v-if="$slots.default"
      :class="contentClasses"
    >
      <slot />
    </span>
    
    <!-- Right icon -->
    <component
      v-if="icon && iconPosition === 'right' && !loading"
      :is="icon"
      :class="iconClasses"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import type { UserRole, ComponentSize, ComponentVariant } from '~/types/design-tokens'
import { useDesignTokens } from '~/composables/useDesignTokens'

export interface ButtonProps {
  /**
   * 按钮变体
   */
  variant?: ComponentVariant
  
  /**
   * 按钮尺寸
   */
  size?: ComponentSize
  
  /**
   * 按钮类型
   */
  type?: 'button' | 'submit' | 'reset'
  
  /**
   * 是否禁用
   */
  disabled?: boolean
  
  /**
   * 是否加载中
   */
  loading?: boolean
  
  /**
   * 图标组件
   */
  icon?: Component
  
  /**
   * 图标位置
   */
  iconPosition?: 'left' | 'right'
  
  /**
   * 是否全宽
   */
  fullWidth?: boolean
  
  /**
   * 用户角色（用于主题）
   */
  role?: UserRole
  
  /**
   * 自定义CSS类
   */
  class?: string
  
  /**
   * 无障碍标签
   */
  ariaLabel?: string
  
  /**
   * 无障碍描述ID
   */
  ariaDescribedBy?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  iconPosition: 'left',
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const { utils } = useDesignTokens()

// 按钮样式类
const buttonClasses = computed(() => {
  const baseClasses = [
    // 基础样式
    'inline-flex items-center justify-center',
    'font-semibold rounded-lg',
    'transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
  ]
  
  // 尺寸相关样式
  const sizeClasses = utils.getSizeClasses(props.size)
  baseClasses.push(sizeClasses.padding, sizeClasses.fontSize)
  
  // 变体相关样式
  const variantClasses = getVariantClasses()
  baseClasses.push(...variantClasses)
  
  // 全宽样式
  if (props.fullWidth) {
    baseClasses.push('w-full')
  }
  
  // 加载状态样式
  if (props.loading) {
    baseClasses.push('cursor-wait')
  }
  
  // 自定义类
  if (props.class) {
    baseClasses.push(props.class)
  }
  
  return utils.mergeClasses(...baseClasses)
})

// 获取变体样式类
const getVariantClasses = (): string[] => {
  const classes: string[] = []
  
  switch (props.variant) {
    case 'primary':
      if (props.role) {
        // 角色主题色
        const roleColorMap = {
          guest: 'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 focus:ring-gray-500',
          client: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500',
          artist: 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 focus:ring-purple-500',
          admin: 'bg-red-600 hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
        }
        classes.push(
          'text-white shadow-sm hover:shadow-md',
          roleColorMap[props.role] || roleColorMap.guest
        )
      } else {
        classes.push(
          'bg-primary-600 text-white shadow-sm hover:shadow-md',
          'hover:bg-primary-700 active:bg-primary-800',
          'focus:ring-primary-500'
        )
      }
      break
      
    case 'secondary':
      if (props.role) {
        const roleColorMap = {
          guest: 'bg-white text-gray-600 border-2 border-gray-600 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500',
          client: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 active:bg-blue-100 focus:ring-blue-500',
          artist: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 active:bg-purple-100 focus:ring-purple-500',
          admin: 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 active:bg-red-100 focus:ring-red-500',
        }
        classes.push(roleColorMap[props.role] || roleColorMap.guest)
      } else {
        classes.push(
          'bg-white text-primary-600 border-2 border-primary-600',
          'hover:bg-primary-50 active:bg-primary-100',
          'focus:ring-primary-500'
        )
      }
      break
      
    case 'outline':
      classes.push(
        'bg-transparent text-gray-700 border-2 border-gray-300',
        'hover:bg-gray-50 active:bg-gray-100',
        'focus:ring-gray-500'
      )
      break
      
    case 'ghost':
      classes.push(
        'bg-transparent text-gray-700',
        'hover:bg-gray-100 active:bg-gray-200',
        'focus:ring-gray-500'
      )
      break
      
    case 'danger':
      classes.push(
        'bg-red-600 text-white shadow-sm hover:shadow-md',
        'hover:bg-red-700 active:bg-red-800',
        'focus:ring-red-500'
      )
      break
  }
  
  return classes
}

// 图标样式类
const iconClasses = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }
  
  return sizeMap[props.size] || sizeMap.md
})

// 内容样式类
const contentClasses = computed(() => {
  if (!props.icon) return ''
  
  const spacingMap = {
    xs: props.iconPosition === 'left' ? 'ml-1' : 'mr-1',
    sm: props.iconPosition === 'left' ? 'ml-1.5' : 'mr-1.5',
    md: props.iconPosition === 'left' ? 'ml-2' : 'mr-2',
    lg: props.iconPosition === 'left' ? 'ml-2.5' : 'mr-2.5',
    xl: props.iconPosition === 'left' ? 'ml-3' : 'mr-3',
  }
  
  return spacingMap[props.size] || spacingMap.md
})

// 加载动画尺寸
const loadingSpinnerSize = computed(() => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }
  
  return sizeMap[props.size] || sizeMap.md
})

// 事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const handleFocus = (event: FocusEvent) => {
  if (!props.disabled) {
    emit('focus', event)
  }
}

const handleBlur = (event: FocusEvent) => {
  if (!props.disabled) {
    emit('blur', event)
  }
}
</script>

<style scoped>
/* 按钮组件的自定义样式 */
button {
  /* 确保按钮在所有浏览器中的一致性 */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  /* 防止文本选择 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  
  /* 确保按钮可以正确聚焦 */
  outline: none;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  button {
    border-width: 2px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
  
  .animate-spin {
    animation: none;
  }
}
</style>