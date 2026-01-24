<!--
  Role Guard Component
  角色守卫组件
  
  A simplified version of PermissionGuard focused specifically on role-based
  access control. Useful for quick role checks without complex permission logic.
-->

<template>
  <div v-if="hasAccess">
    <slot />
  </div>
  <div v-else-if="showFallback">
    <slot name="fallback">
      <div :class="defaultErrorClass">
        <p class="text-sm text-gray-600">
          此内容需要{{ requiredRoleDisplay }}权限
        </p>
        <button
          v-if="showUpgradeButton"
          @click="handleUpgrade"
          class="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          升级账户
        </button>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { UserRole } from '~/types/design-tokens'
import { useRolePermissions } from '~/composables/useRolePermissions'

export interface RoleGuardProps {
  /**
   * 所需角色
   */
  role: UserRole
  
  /**
   * 是否允许相同或更高角色访问
   */
  allowHigher?: boolean
  
  /**
   * 是否显示无权限提示
   */
  showFallback?: boolean
  
  /**
   * 是否显示升级按钮
   */
  showUpgradeButton?: boolean
  
  /**
   * 自定义错误样式类
   */
  errorClass?: string
}

const props = withDefaults(defineProps<RoleGuardProps>(), {
  allowHigher: true,
  showFallback: true,
  showUpgradeButton: true,
  errorClass: '',
})

const emit = defineEmits<{
  upgrade: [targetRole: UserRole]
  accessDenied: [requiredRole: UserRole, currentRole: UserRole]
  accessGranted: [currentRole: UserRole]
}>()

const {
  currentRole,
  hasEqualOrHigherRole,
  canUpgradeToRole,
} = useRolePermissions()

// 权限检查
const hasAccess = computed(() => {
  if (props.allowHigher) {
    return hasEqualOrHigherRole(props.role)
  } else {
    return currentRole.value === props.role
  }
})

// 角色显示名称
const requiredRoleDisplay = computed(() => {
  const roleNames = {
    guest: '游客',
    client: '客户',
    artist: '画师',
    admin: '管理员',
  }
  
  return roleNames[props.role] || props.role
})

// 是否显示升级按钮
const showUpgradeButton = computed(() => {
  return props.showUpgradeButton && canUpgradeToRole(props.role)
})

// 默认错误样式
const defaultErrorClass = computed(() => {
  return props.errorClass || 'p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center'
})

// 事件处理
const handleUpgrade = () => {
  emit('upgrade', props.role)
}

// 监听访问状态变化
watch(hasAccess, (newValue) => {
  if (newValue) {
    emit('accessGranted', currentRole.value)
  } else {
    emit('accessDenied', props.role, currentRole.value)
  }
}, { immediate: true })
</script>

<style scoped>
/* 组件样式已通过 Tailwind CSS 类实现 */
</style>