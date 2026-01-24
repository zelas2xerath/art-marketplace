/**
 * Permission Navigation Composable
 * 权限导航组合式函数
 * 
 * This composable provides navigation utilities with permission checking
 * and error handling for unauthorized access attempts.
 */

import { ref, computed, type Ref } from 'vue'
import type { UserRole } from '~/types/design-tokens'
import { useRolePermissions } from './useRolePermissions'

export interface NavigationOptions {
  /**
   * 检查权限后再导航
   */
  checkPermission?: boolean
  
  /**
   * 所需角色
   */
  requiredRole?: UserRole
  
  /**
   * 所需权限
   */
  requiredPermission?: {
    resource: string
    action: string
  }
  
  /**
   * 所需功能
   */
  requiredFeature?: string
  
  /**
   * 无权限时的回调
   */
  onUnauthorized?: (reason: string) => void
  
  /**
   * 无权限时是否显示错误提示
   */
  showErrorOnUnauthorized?: boolean
  
  /**
   * 自定义错误消息
   */
  customErrorMessage?: string
}

export interface UsePermissionNavigationReturn {
  // 状态
  isNavigating: Ref<boolean>
  lastError: Ref<string | null>
  
  // 导航方法
  navigateWithPermission: (to: string, options?: NavigationOptions) => Promise<boolean>
  navigateToLogin: (redirectTo?: string) => Promise<void>
  navigateToUpgrade: (targetRole?: UserRole) => Promise<void>
  navigateToContactAdmin: (reason?: string) => Promise<void>
  
  // 权限检查方法
  canNavigateTo: (to: string, options?: NavigationOptions) => boolean
  checkPagePermission: (pagePath: string) => boolean
  
  // 错误处理方法
  handlePermissionError: (error: string, options?: { showToast?: boolean }) => void
  clearError: () => void
  
  // 工具方法
  getLoginUrl: (redirectTo?: string) => string
  getUpgradeUrl: (targetRole?: UserRole) => string
  getContactAdminUrl: (reason?: string) => string
}

/**
 * 权限导航组合式函数
 */
export function usePermissionNavigation(): UsePermissionNavigationReturn {
  const {
    currentRole,
    hasPermission,
    canAccessPage,
    canAccessFeature,
    hasEqualOrHigherRole,
    canUpgradeToRole,
  } = useRolePermissions()
  
  // 状态
  const isNavigating = ref(false)
  const lastError = ref<string | null>(null)
  
  // 权限检查
  const checkPermissions = (options: NavigationOptions): { hasAccess: boolean; reason: string } => {
    // 角色检查
    if (options.requiredRole && !hasEqualOrHigherRole(options.requiredRole)) {
      return {
        hasAccess: false,
        reason: `需要${options.requiredRole}角色权限`,
      }
    }
    
    // 权限检查
    if (options.requiredPermission) {
      const { resource, action } = options.requiredPermission
      if (!hasPermission(resource, action)) {
        return {
          hasAccess: false,
          reason: `需要${resource}:${action}权限`,
        }
      }
    }
    
    // 功能检查
    if (options.requiredFeature && !canAccessFeature(options.requiredFeature)) {
      return {
        hasAccess: false,
        reason: `需要${options.requiredFeature}功能权限`,
      }
    }
    
    return { hasAccess: true, reason: '' }
  }
  
  // 带权限检查的导航
  const navigateWithPermission = async (
    to: string,
    options: NavigationOptions = {}
  ): Promise<boolean> => {
    isNavigating.value = true
    lastError.value = null
    
    try {
      // 如果不需要检查权限，直接导航
      if (!options.checkPermission) {
        await navigateTo(to)
        return true
      }
      
      // 检查页面访问权限
      if (!canAccessPage(to)) {
        const reason = '无权限访问此页面'
        lastError.value = reason
        
        if (options.onUnauthorized) {
          options.onUnauthorized(reason)
        }
        
        if (options.showErrorOnUnauthorized) {
          handlePermissionError(options.customErrorMessage || reason)
        }
        
        return false
      }
      
      // 检查其他权限
      const { hasAccess, reason } = checkPermissions(options)
      
      if (!hasAccess) {
        lastError.value = reason
        
        if (options.onUnauthorized) {
          options.onUnauthorized(reason)
        }
        
        if (options.showErrorOnUnauthorized) {
          handlePermissionError(options.customErrorMessage || reason)
        }
        
        return false
      }
      
      // 权限检查通过，执行导航
      await navigateTo(to)
      return true
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导航失败'
      lastError.value = errorMessage
      handlePermissionError(errorMessage)
      return false
      
    } finally {
      isNavigating.value = false
    }
  }
  
  // 导航到登录页面
  const navigateToLogin = async (redirectTo?: string): Promise<void> => {
    const loginUrl = getLoginUrl(redirectTo)
    await navigateTo(loginUrl)
  }
  
  // 导航到角色升级页面
  const navigateToUpgrade = async (targetRole?: UserRole): Promise<void> => {
    const upgradeUrl = getUpgradeUrl(targetRole)
    await navigateTo(upgradeUrl)
  }
  
  // 导航到联系管理员页面
  const navigateToContactAdmin = async (reason?: string): Promise<void> => {
    const contactUrl = getContactAdminUrl(reason)
    await navigateTo(contactUrl)
  }
  
  // 检查是否可以导航到指定页面
  const canNavigateTo = (to: string, options: NavigationOptions = {}): boolean => {
    // 检查页面访问权限
    if (!canAccessPage(to)) {
      return false
    }
    
    // 检查其他权限
    const { hasAccess } = checkPermissions(options)
    return hasAccess
  }
  
  // 检查页面权限
  const checkPagePermission = (pagePath: string): boolean => {
    return canAccessPage(pagePath)
  }
  
  // 处理权限错误
  const handlePermissionError = (
    error: string,
    options: { showToast?: boolean } = {}
  ): void => {
    lastError.value = error
    
    // 显示错误提示（这里可以集成 toast 组件）
    if (options.showToast !== false) {
      console.warn('Permission Error:', error)
      // TODO: 集成实际的 toast 组件
      // showToast({ type: 'error', message: error })
    }
  }
  
  // 清除错误
  const clearError = (): void => {
    lastError.value = null
  }
  
  // 获取登录URL
  const getLoginUrl = (redirectTo?: string): string => {
    const loginPath = '/auth/login'
    
    if (redirectTo) {
      return `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`
    }
    
    // 使用当前路径作为重定向目标
    const currentPath = useRoute().fullPath
    return `${loginPath}?redirect=${encodeURIComponent(currentPath)}`
  }
  
  // 获取角色升级URL
  const getUpgradeUrl = (targetRole?: UserRole): string => {
    const upgradePath = '/profile/upgrade'
    
    if (targetRole) {
      return `${upgradePath}?target=${targetRole}`
    }
    
    return upgradePath
  }
  
  // 获取联系管理员URL
  const getContactAdminUrl = (reason?: string): string => {
    const contactPath = '/contact'
    
    if (reason) {
      return `${contactPath}?subject=permission-request&reason=${encodeURIComponent(reason)}`
    }
    
    return `${contactPath}?subject=permission-request`
  }
  
  return {
    // 状态
    isNavigating,
    lastError,
    
    // 导航方法
    navigateWithPermission,
    navigateToLogin,
    navigateToUpgrade,
    navigateToContactAdmin,
    
    // 权限检查方法
    canNavigateTo,
    checkPagePermission,
    
    // 错误处理方法
    handlePermissionError,
    clearError,
    
    // 工具方法
    getLoginUrl,
    getUpgradeUrl,
    getContactAdminUrl,
  }
}

/**
 * 全局权限导航工具函数
 */
export const globalPermissionNavigation = {
  /**
   * 检查并导航到指定路径
   */
  async navigateWithCheck(
    to: string,
    currentRole: UserRole,
    options: NavigationOptions = {}
  ): Promise<boolean> {
    // 这里可以实现全局的权限检查逻辑
    // 暂时简化实现
    return true
  },
  
  /**
   * 获取权限错误重定向路径
   */
  getPermissionErrorRedirect(currentRole: UserRole, targetPath: string): string {
    if (currentRole === 'guest') {
      return `/auth/login?redirect=${encodeURIComponent(targetPath)}`
    }
    
    return '/403'
  },
}

export default usePermissionNavigation