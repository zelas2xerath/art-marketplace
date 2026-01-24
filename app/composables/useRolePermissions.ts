/**
 * Role-based Permission Management Composable
 * 基于角色的权限管理组合式函数
 * 
 * This composable provides reactive permission checking and role management
 * functionality for Vue components.
 */

import { computed, ref, type ComputedRef, type Ref } from 'vue'
import type { UserRole, Permission, UIAccess, ThemeConfig } from '~/types/design-tokens'
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  hasFullResourceAccess,
  hasReadWriteAccess,
  canAccessPage,
  canAccessComponent,
  canAccessFeature,
  getAccessibleFeatures,
  canAccessAnyFeature,
  canAccessAllFeatures,
  getUserRoleConfig,
  getUserTheme,
  canUpgradeToRole,
  isValidUserRole,
  getRoleHierarchy,
  hasHigherRole,
  hasEqualOrHigherRole,
  getRoleDisplayName,
  getRoleDescription,
} from '~/config/user-roles'

export interface UseRolePermissionsOptions {
  /**
   * 初始用户角色
   */
  initialRole?: UserRole
  
  /**
   * 是否启用权限缓存
   */
  enableCache?: boolean
}

export interface UseRolePermissionsReturn {
  // 响应式状态
  currentRole: Ref<UserRole>
  roleConfig: ComputedRef
  theme: ComputedRef<ThemeConfig>
  permissions: ComputedRef<Permission[]>
  accessibleFeatures: ComputedRef<string[]>
  
  // 权限检查方法
  hasPermission: (resource: string, action: string) => boolean
  hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => boolean
  hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => boolean
  hasFullResourceAccess: (resource: string) => boolean
  hasReadWriteAccess: (resource: string) => boolean
  
  // UI访问控制方法
  canAccessPage: (pagePath: string) => boolean
  canAccessComponent: (componentName: string) => boolean
  canAccessFeature: (featureName: string) => boolean
  canAccessAnyFeature: (featureNames: string[]) => boolean
  canAccessAllFeatures: (featureNames: string[]) => boolean
  
  // 角色管理方法
  setRole: (role: UserRole) => void
  canUpgradeToRole: (targetRole: UserRole) => boolean
  hasHigherRole: (compareRole: UserRole) => boolean
  hasEqualOrHigherRole: (compareRole: UserRole) => boolean
  
  // 工具方法
  getRoleDisplayName: () => string
  getRoleDescription: () => string
  isValidRole: (role: string) => role is UserRole
}

/**
 * 角色权限管理组合式函数
 */
export function useRolePermissions(
  options: UseRolePermissionsOptions = {}
): UseRolePermissionsReturn {
  const {
    initialRole = 'guest',
    enableCache = true,
  } = options
  
  // 响应式状态
  const currentRole = ref<UserRole>(initialRole)
  
  // 权限缓存
  const permissionCache = enableCache ? new Map<string, boolean>() : null
  
  // 计算属性
  const roleConfig = computed(() => getUserRoleConfig(currentRole.value))
  const theme = computed(() => getUserTheme(currentRole.value))
  const permissions = computed(() => getUserPermissions(currentRole.value))
  const accessibleFeatures = computed(() => getAccessibleFeatures(currentRole.value))
  
  // 缓存键生成
  const getCacheKey = (type: string, ...args: string[]): string => {
    return `${currentRole.value}:${type}:${args.join(':')}`
  }
  
  // 权限检查方法（带缓存）
  const checkPermissionWithCache = (
    checkFn: () => boolean,
    cacheKey: string
  ): boolean => {
    if (!permissionCache) return checkFn()
    
    if (permissionCache.has(cacheKey)) {
      return permissionCache.get(cacheKey)!
    }
    
    const result = checkFn()
    permissionCache.set(cacheKey, result)
    return result
  }
  
  // 清除缓存
  const clearCache = () => {
    if (permissionCache) {
      permissionCache.clear()
    }
  }
  
  // 权限检查方法
  const hasPermissionMethod = (resource: string, action: string): boolean => {
    const cacheKey = getCacheKey('permission', resource, action)
    return checkPermissionWithCache(
      () => hasPermission(currentRole.value, resource, action),
      cacheKey
    )
  }
  
  const hasAnyPermissionMethod = (
    permissionList: Array<{ resource: string; action: string }>
  ): boolean => {
    const cacheKey = getCacheKey('any-permission', JSON.stringify(permissionList))
    return checkPermissionWithCache(
      () => hasAnyPermission(currentRole.value, permissionList),
      cacheKey
    )
  }
  
  const hasAllPermissionsMethod = (
    permissionList: Array<{ resource: string; action: string }>
  ): boolean => {
    const cacheKey = getCacheKey('all-permissions', JSON.stringify(permissionList))
    return checkPermissionWithCache(
      () => hasAllPermissions(currentRole.value, permissionList),
      cacheKey
    )
  }
  
  const hasFullResourceAccessMethod = (resource: string): boolean => {
    const cacheKey = getCacheKey('full-resource', resource)
    return checkPermissionWithCache(
      () => hasFullResourceAccess(currentRole.value, resource),
      cacheKey
    )
  }
  
  const hasReadWriteAccessMethod = (resource: string): boolean => {
    const cacheKey = getCacheKey('read-write', resource)
    return checkPermissionWithCache(
      () => hasReadWriteAccess(currentRole.value, resource),
      cacheKey
    )
  }
  
  // UI访问控制方法
  const canAccessPageMethod = (pagePath: string): boolean => {
    const cacheKey = getCacheKey('page', pagePath)
    return checkPermissionWithCache(
      () => canAccessPage(currentRole.value, pagePath),
      cacheKey
    )
  }
  
  const canAccessComponentMethod = (componentName: string): boolean => {
    const cacheKey = getCacheKey('component', componentName)
    return checkPermissionWithCache(
      () => canAccessComponent(currentRole.value, componentName),
      cacheKey
    )
  }
  
  const canAccessFeatureMethod = (featureName: string): boolean => {
    const cacheKey = getCacheKey('feature', featureName)
    return checkPermissionWithCache(
      () => canAccessFeature(currentRole.value, featureName),
      cacheKey
    )
  }
  
  const canAccessAnyFeatureMethod = (featureNames: string[]): boolean => {
    const cacheKey = getCacheKey('any-feature', JSON.stringify(featureNames))
    return checkPermissionWithCache(
      () => canAccessAnyFeature(currentRole.value, featureNames),
      cacheKey
    )
  }
  
  const canAccessAllFeaturesMethod = (featureNames: string[]): boolean => {
    const cacheKey = getCacheKey('all-features', JSON.stringify(featureNames))
    return checkPermissionWithCache(
      () => canAccessAllFeatures(currentRole.value, featureNames),
      cacheKey
    )
  }
  
  // 角色管理方法
  const setRole = (role: UserRole): void => {
    if (isValidUserRole(role)) {
      currentRole.value = role
      clearCache() // 清除缓存，因为角色已更改
    } else {
      console.warn(`Invalid user role: ${role}`)
    }
  }
  
  const canUpgradeToRoleMethod = (targetRole: UserRole): boolean => {
    return canUpgradeToRole(currentRole.value, targetRole)
  }
  
  const hasHigherRoleMethod = (compareRole: UserRole): boolean => {
    return hasHigherRole(currentRole.value, compareRole)
  }
  
  const hasEqualOrHigherRoleMethod = (compareRole: UserRole): boolean => {
    return hasEqualOrHigherRole(currentRole.value, compareRole)
  }
  
  // 工具方法
  const getRoleDisplayNameMethod = (): string => {
    return getRoleDisplayName(currentRole.value)
  }
  
  const getRoleDescriptionMethod = (): string => {
    return getRoleDescription(currentRole.value)
  }
  
  const isValidRoleMethod = (role: string): role is UserRole => {
    return isValidUserRole(role)
  }
  
  return {
    // 响应式状态
    currentRole,
    roleConfig,
    theme,
    permissions,
    accessibleFeatures,
    
    // 权限检查方法
    hasPermission: hasPermissionMethod,
    hasAnyPermission: hasAnyPermissionMethod,
    hasAllPermissions: hasAllPermissionsMethod,
    hasFullResourceAccess: hasFullResourceAccessMethod,
    hasReadWriteAccess: hasReadWriteAccessMethod,
    
    // UI访问控制方法
    canAccessPage: canAccessPageMethod,
    canAccessComponent: canAccessComponentMethod,
    canAccessFeature: canAccessFeatureMethod,
    canAccessAnyFeature: canAccessAnyFeatureMethod,
    canAccessAllFeatures: canAccessAllFeaturesMethod,
    
    // 角色管理方法
    setRole,
    canUpgradeToRole: canUpgradeToRoleMethod,
    hasHigherRole: hasHigherRoleMethod,
    hasEqualOrHigherRole: hasEqualOrHigherRoleMethod,
    
    // 工具方法
    getRoleDisplayName: getRoleDisplayNameMethod,
    getRoleDescription: getRoleDescriptionMethod,
    isValidRole: isValidRoleMethod,
  }
}

// 全局权限检查工具函数（用于非组件环境）
export const globalPermissionUtils = {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getUserPermissions,
  hasFullResourceAccess,
  hasReadWriteAccess,
  canAccessPage,
  canAccessComponent,
  canAccessFeature,
  getAccessibleFeatures,
  canAccessAnyFeature,
  canAccessAllFeatures,
  getUserRoleConfig,
  getUserTheme,
  canUpgradeToRole,
  isValidUserRole,
  getRoleHierarchy,
  hasHigherRole,
  hasEqualOrHigherRole,
  getRoleDisplayName,
  getRoleDescription,
}

export default useRolePermissions