<!--
  Permission Error Component
  权限错误处理界面组件
  
  This component displays user-friendly error messages for different types
  of permission errors and provides appropriate actions for users.
-->

<template>
  <div :class="containerClass">
    <!-- 错误图标 -->
    <div :class="iconContainerClass">
      <component :is="errorIcon" :class="iconClass" />
    </div>
    
    <!-- 错误标题 -->
    <h3 :class="titleClass">
      {{ errorTitle }}
    </h3>
    
    <!-- 错误描述 -->
    <p :class="descriptionClass">
      {{ errorDescription }}
    </p>
    
    <!-- 权限详情 -->
    <div v-if="showPermissionDetails" :class="detailsClass">
      <p class="text-sm text-gray-600">
        <span class="font-medium">当前角色:</span> {{ currentRoleDisplay }}
      </p>
      <p v-if="requiredRole" class="text-sm text-gray-600">
        <span class="font-medium">所需角色:</span> {{ requiredRoleDisplay }}
      </p>
      <p v-if="requiredPermission" class="text-sm text-gray-600">
        <span class="font-medium">所需权限:</span> {{ requiredPermission }}
      </p>
    </div>
    
    <!-- 操作按钮 -->
    <div :class="actionsClass">
      <!-- 登录按钮 -->
      <button
        v-if="showLogin && errorType === 'login-required'"
        @click="handleLogin"
        :class="primaryButtonClass"
      >
        <LoginIcon class="w-4 h-4 mr-2" />
        立即登录
      </button>
      
      <!-- 角色升级按钮 -->
      <button
        v-if="showUpgrade && errorType === 'insufficient-role' && canUpgrade"
        @click="handleUpgrade"
        :class="primaryButtonClass"
      >
        <UpgradeIcon class="w-4 h-4 mr-2" />
        升级到{{ requiredRoleDisplay }}
      </button>
      
      <!-- 联系管理员按钮 -->
      <button
        v-if="errorType === 'insufficient-permission' || (errorType === 'insufficient-role' && !canUpgrade)"
        @click="handleContactAdmin"
        :class="secondaryButtonClass"
      >
        <ContactIcon class="w-4 h-4 mr-2" />
        联系管理员
      </button>
      
      <!-- 返回按钮 -->
      <button
        @click="handleGoBack"
        :class="secondaryButtonClass"
      >
        <BackIcon class="w-4 h-4 mr-2" />
        返回
      </button>
    </div>
    
    <!-- 帮助链接 -->
    <div v-if="showHelpLinks" :class="helpLinksClass">
      <a
        href="/help/permissions"
        target="_blank"
        class="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        了解权限系统
      </a>
      <span class="text-gray-400 mx-2">|</span>
      <a
        href="/help/roles"
        target="_blank"
        class="text-sm text-blue-600 hover:text-blue-800 underline"
      >
        用户角色说明
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserRole } from '~/types/design-tokens'
import { useRolePermissions } from '~/composables/useRolePermissions'
import {
  ShieldExclamationIcon,
  UserIcon,
  LockClosedIcon,
  ArrowRightStartOnRectangleIcon as LoginIcon,
  ArrowUpIcon as UpgradeIcon,
  ChatBubbleLeftRightIcon as ContactIcon,
  ArrowLeftIcon as BackIcon,
} from '@heroicons/vue/24/outline'

export interface PermissionErrorProps {
  /**
   * 错误类型
   */
  errorType: 'login-required' | 'insufficient-role' | 'insufficient-permission'
  
  /**
   * 所需角色
   */
  requiredRole?: UserRole | null
  
  /**
   * 所需权限描述
   */
  requiredPermission?: string | null
  
  /**
   * 是否显示升级选项
   */
  showUpgrade?: boolean
  
  /**
   * 是否显示登录选项
   */
  showLogin?: boolean
  
  /**
   * 是否显示权限详情
   */
  showPermissionDetails?: boolean
  
  /**
   * 是否显示帮助链接
   */
  showHelpLinks?: boolean
  
  /**
   * 自定义样式大小
   */
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<PermissionErrorProps>(), {
  showUpgrade: true,
  showLogin: true,
  showPermissionDetails: true,
  showHelpLinks: true,
  size: 'md',
})

const emit = defineEmits<{
  login: []
  upgrade: []
  contactAdmin: []
  goBack: []
}>()

const {
  currentRole,
  getRoleDisplayName,
  canUpgradeToRole,
} = useRolePermissions()

// 当前角色显示名称
const currentRoleDisplay = computed(() => getRoleDisplayName())

// 所需角色显示名称
const requiredRoleDisplay = computed(() => {
  if (!props.requiredRole) return ''
  
  const roleNames = {
    guest: '游客',
    client: '客户',
    artist: '画师',
    admin: '管理员',
  }
  
  return roleNames[props.requiredRole] || props.requiredRole
})

// 是否可以升级角色
const canUpgrade = computed(() => {
  return props.requiredRole ? canUpgradeToRole(props.requiredRole) : false
})

// 错误图标
const errorIcon = computed(() => {
  switch (props.errorType) {
    case 'login-required':
      return UserIcon
    case 'insufficient-role':
      return LockClosedIcon
    case 'insufficient-permission':
      return ShieldExclamationIcon
    default:
      return ShieldExclamationIcon
  }
})

// 错误标题
const errorTitle = computed(() => {
  switch (props.errorType) {
    case 'login-required':
      return '需要登录'
    case 'insufficient-role':
      return '权限不足'
    case 'insufficient-permission':
      return '访问受限'
    default:
      return '访问被拒绝'
  }
})

// 错误描述
const errorDescription = computed(() => {
  switch (props.errorType) {
    case 'login-required':
      return '您需要登录后才能访问此内容。请使用您的账户登录以继续。'
    case 'insufficient-role':
      return `此功能需要${requiredRoleDisplay.value}权限。您当前的角色是${currentRoleDisplay.value}。`
    case 'insufficient-permission':
      return '您没有足够的权限访问此内容。如需帮助，请联系管理员。'
    default:
      return '您无法访问此内容。'
  }
})

// 样式类
const sizeClasses = computed(() => {
  const sizes = {
    sm: {
      container: 'p-4',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-3 py-1.5 text-sm',
    },
    md: {
      container: 'p-6',
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-4 py-2 text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'w-16 h-16',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-6 py-3 text-base',
    },
  }
  
  return sizes[props.size]
})

const containerClass = computed(() => [
  'flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-gray-200',
  sizeClasses.value.container,
])

const iconContainerClass = computed(() => [
  'mb-4 p-3 bg-red-100 rounded-full',
])

const iconClass = computed(() => [
  'text-red-600',
  sizeClasses.value.icon,
])

const titleClass = computed(() => [
  'font-semibold text-gray-900 mb-2',
  sizeClasses.value.title,
])

const descriptionClass = computed(() => [
  'text-gray-600 mb-4 max-w-md',
  sizeClasses.value.description,
])

const detailsClass = computed(() => [
  'mb-6 p-3 bg-gray-100 rounded-md text-left w-full max-w-md',
])

const actionsClass = computed(() => [
  'flex flex-wrap gap-3 justify-center mb-4',
])

const primaryButtonClass = computed(() => [
  'inline-flex items-center font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 rounded-lg transition-colors duration-200',
  sizeClasses.value.button,
])

const secondaryButtonClass = computed(() => [
  'inline-flex items-center font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 border border-gray-300 rounded-lg transition-colors duration-200',
  sizeClasses.value.button,
])

const helpLinksClass = computed(() => [
  'text-center',
])

// 事件处理
const handleLogin = () => {
  emit('login')
}

const handleUpgrade = () => {
  emit('upgrade')
}

const handleContactAdmin = () => {
  emit('contactAdmin')
}

const handleGoBack = () => {
  emit('goBack')
  // 默认行为：返回上一页
  if (typeof window !== 'undefined' && window.history.length > 1) {
    window.history.back()
  } else {
    // 如果没有历史记录，跳转到首页
    navigateTo('/')
  }
}
</script>

<style scoped>
/* 组件样式已通过 Tailwind CSS 类实现 */
</style>