<!--
  Permission Guard Component
  权限访问控制组件
  
  This component provides role-based access control for UI elements and pages.
  It checks user permissions and displays content conditionally or shows
  appropriate error messages for unauthorized access.
-->

<template>
  <div>
    <!-- 有权限时显示内容 -->
    <div v-if="hasAccess" :class="wrapperClass">
      <slot />
    </div>
    
    <!-- 无权限时显示错误提示 -->
    <div v-else-if="showFallback" :class="errorWrapperClass">
      <slot name="fallback">
        <PermissionError
          :error-type="errorType"
          :required-role="requiredRole"
          :required-permission="requiredPermission"
          :show-upgrade="showUpgrade"
          :show-login="showLogin"
          @login="handleLogin"
          @upgrade="handleUpgrade"
          @contact-admin="handleContactAdmin"
        />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, type ComputedRef } from 'vue'
import type { UserRole } from '~/types/design-tokens'
import { useRolePermissions } from '~/composables/useRolePermissions'
import PermissionError from './PermissionError.vue'

export interface PermissionGuardProps {
  /**
   * 资源名称（用于权限检查）
   */
  resource?: string
  
  /**
   * 操作类型（用于权限检查）
   */
  action?: string
  
  /**
   * 功能名称（用于功能访问检查）
   */
  feature?: string
  
  /**
   * 页面路径（用于页面访问检查）
   */
  page?: string
  
  /**
   * 组件名称（用于组件访问检查）
   */
  component?: string
  
  /**
   * 所需角色（用于角色检查）
   */
  role?: UserRole
  
  /**
   * 多个权限检查（任一满足即可）
   */
  anyPermissions?: Array<{ resource: string; action: string }>
  
  /**
   * 多个权限检查（全部满足才可）
   */
  allPermissions?: Array<{ resource: string; action: string }>
  
  /**
   * 多个功能检查（任一满足即可）
   */
  anyFeatures?: string[]
  
  /**
   * 多个功能检查（全部满足才可）
   */
  allFeatures?: string[]
  
  /**
   * 是否显示无权限提示
   */
  showFallback?: boolean
  
  /**
   * 是否显示角色升级选项
   */
  showUpgrade?: boolean
  
  /**
   * 是否显示登录选项
   */
  showLogin?: boolean
  
  /**
   * 包装器CSS类
   */
  wrapperClass?: string
  
  /**
   * 错误提示包装器CSS类
   */
  errorWrapperClass?: string
  
  /**
   * 严格模式（所有条件都必须满足）
   */
  strict?: boolean
}

const props = withDefaults(defineProps<PermissionGuardProps>(), {
  showFallback: true,
  showUpgrade: true,
  showLogin: true,
  wrapperClass: '',
  errorWrapperClass: '',
  strict: false,
})

const emit = defineEmits<{
  login: []
  upgrade: [targetRole: UserRole]
  contactAdmin: []
  accessDenied: [reason: string]
  accessGranted: []
}>()

const {
  currentRole,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessFeature,
  canAccessPage,
  canAccessComponent,
  canAccessAnyFeature,
  canAccessAllFeatures,
  hasEqualOrHigherRole,
  canUpgradeToRole,
} = useRolePermissions()

// 权限检查逻辑
const hasAccess: ComputedRef<boolean> = computed(() => {
  const checks: boolean[] = []
  
  // 基础权限检查
  if (props.resource && props.action) {
    checks.push(hasPermission(props.resource, props.action))
  }
  
  // 功能访问检查
  if (props.feature) {
    checks.push(canAccessFeature(props.feature))
  }
  
  // 页面访问检查
  if (props.page) {
    checks.push(canAccessPage(props.page))
  }
  
  // 组件访问检查
  if (props.component) {
    checks.push(canAccessComponent(props.component))
  }
  
  // 角色检查
  if (props.role) {
    checks.push(hasEqualOrHigherRole(props.role))
  }
  
  // 多权限检查（任一满足）
  if (props.anyPermissions && props.anyPermissions.length > 0) {
    checks.push(hasAnyPermission(props.anyPermissions))
  }
  
  // 多权限检查（全部满足）
  if (props.allPermissions && props.allPermissions.length > 0) {
    checks.push(hasAllPermissions(props.allPermissions))
  }
  
  // 多功能检查（任一满足）
  if (props.anyFeatures && props.anyFeatures.length > 0) {
    checks.push(canAccessAnyFeature(props.anyFeatures))
  }
  
  // 多功能检查（全部满足）
  if (props.allFeatures && props.allFeatures.length > 0) {
    checks.push(canAccessAllFeatures(props.allFeatures))
  }
  
  // 如果没有任何检查条件，默认允许访问
  if (checks.length === 0) {
    return true
  }
  
  // 严格模式：所有条件都必须满足
  if (props.strict) {
    return checks.every(check => check)
  }
  
  // 非严格模式：任一条件满足即可
  return checks.some(check => check)
})

// 错误类型
const errorType = computed(() => {
  if (currentRole.value === 'guest') {
    return 'login-required'
  }
  
  if (props.role && !hasEqualOrHigherRole(props.role)) {
    return 'insufficient-role'
  }
  
  return 'insufficient-permission'
})

// 所需角色
const requiredRole = computed(() => {
  return props.role || null
})

// 所需权限描述
const requiredPermission = computed(() => {
  if (props.resource && props.action) {
    return `${props.resource}:${props.action}`
  }
  
  if (props.feature) {
    return `feature:${props.feature}`
  }
  
  if (props.page) {
    return `page:${props.page}`
  }
  
  if (props.component) {
    return `component:${props.component}`
  }
  
  return null
})

// 事件处理
const handleLogin = () => {
  emit('login')
}

const handleUpgrade = () => {
  if (props.role && canUpgradeToRole(props.role)) {
    emit('upgrade', props.role)
  }
}

const handleContactAdmin = () => {
  emit('contactAdmin')
}

// 监听访问状态变化
watch(hasAccess, (newValue) => {
  if (newValue) {
    emit('accessGranted')
  } else {
    const reason = `Access denied: ${errorType.value}`
    emit('accessDenied', reason)
  }
}, { immediate: true })
</script>

<style scoped>
/* 组件样式可以根据需要添加 */
</style>