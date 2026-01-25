/**
 * Permission Middleware
 * 权限中间件
 * 
 * This middleware provides page-level permission control for Nuxt routes.
 * It checks user permissions before allowing access to protected pages.
 */

import type { UserRole } from '~/types/design-tokens'
import { globalPermissionUtils } from '~/composables/useRolePermissions'

export interface PermissionMiddlewareOptions {
  /**
   * 所需角色
   */
  role?: UserRole
  
  /**
   * 所需权限
   */
  permission?: {
    resource: string
    action: string
  }
  
  /**
   * 所需功能
   */
  feature?: string
  
  /**
   * 多个权限（任一满足）
   */
  anyPermissions?: Array<{ resource: string; action: string }>
  
  /**
   * 多个权限（全部满足）
   */
  allPermissions?: Array<{ resource: string; action: string }>
  
  /**
   * 多个功能（任一满足）
   */
  anyFeatures?: string[]
  
  /**
   * 多个功能（全部满足）
   */
  allFeatures?: string[]
  
  /**
   * 重定向路径（无权限时）
   */
  redirectTo?: string
  
  /**
   * 是否显示错误页面而不是重定向
   */
  showErrorPage?: boolean
}

/**
 * 创建权限中间件
 */
export function createPermissionMiddleware(options: PermissionMiddlewareOptions) {
  return defineNuxtRouteMiddleware((to) => {
    // 获取当前用户角色（这里需要根据实际的认证系统来获取）
    // 暂时使用默认值，实际应用中应该从认证状态中获取
    const currentRole: UserRole = 'guest' // TODO: 从认证系统获取实际角色
    
    const checks: boolean[] = []
    
    // 角色检查
    if (options.role) {
      checks.push(globalPermissionUtils.hasEqualOrHigherRole(currentRole, options.role))
    }
    
    // 单个权限检查
    if (options.permission) {
      checks.push(globalPermissionUtils.hasPermission(
        currentRole,
        options.permission.resource,
        options.permission.action
      ))
    }
    
    // 功能检查
    if (options.feature) {
      checks.push(globalPermissionUtils.canAccessFeature(currentRole, options.feature))
    }
    
    // 多权限检查（任一满足）
    if (options.anyPermissions && options.anyPermissions.length > 0) {
      checks.push(globalPermissionUtils.hasAnyPermission(currentRole, options.anyPermissions))
    }
    
    // 多权限检查（全部满足）
    if (options.allPermissions && options.allPermissions.length > 0) {
      checks.push(globalPermissionUtils.hasAllPermissions(currentRole, options.allPermissions))
    }
    
    // 多功能检查（任一满足）
    if (options.anyFeatures && options.anyFeatures.length > 0) {
      checks.push(globalPermissionUtils.canAccessAnyFeature(currentRole, options.anyFeatures))
    }
    
    // 多功能检查（全部满足）
    if (options.allFeatures && options.allFeatures.length > 0) {
      checks.push(globalPermissionUtils.canAccessAllFeatures(currentRole, options.allFeatures))
    }
    
    // 如果没有任何检查条件，默认允许访问
    if (checks.length === 0) {
      return
    }
    
    // 检查是否有权限访问
    const hasAccess = checks.every(check => check)
    
    if (!hasAccess) {
      // 无权限时的处理
      if (options.showErrorPage) {
        // 显示错误页面
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          data: {
            errorType: currentRole === 'guest' ? 'login-required' : 'insufficient-permission',
            requiredRole: options.role,
            requiredPermission: options.permission,
            requiredFeature: options.feature,
            currentRole,
          }
        })
      } else {
        // 重定向处理
        const redirectPath = options.redirectTo || (currentRole === 'guest' ? '/auth/login' : '/403')
        
        // 保存原始路径用于登录后重定向
        if (currentRole === 'guest') {
          const redirectUrl = new URL(redirectPath, 'http://localhost')
          redirectUrl.searchParams.set('redirect', to.fullPath)
          return navigateTo(redirectUrl.pathname + redirectUrl.search)
        }
        
        return navigateTo(redirectPath)
      }
    }
  })
}

/**
 * 预定义的权限中间件
 */

// 需要登录
export const requireAuth = createPermissionMiddleware({
  role: 'client',
  redirectTo: '/auth/login',
})

// 需要客户权限
export const requireClient = createPermissionMiddleware({
  role: 'client',
  showErrorPage: true,
})

// 需要画师权限
export const requireArtist = createPermissionMiddleware({
  role: 'artist',
  showErrorPage: true,
})

// 需要管理员权限
export const requireAdmin = createPermissionMiddleware({
  role: 'admin',
  showErrorPage: true,
})

// 需要作品创建权限
export const requireArtworkCreate = createPermissionMiddleware({
  permission: {
    resource: 'artwork',
    action: 'create',
  },
  showErrorPage: true,
})

// 需要订单管理权限
export const requireOrderManagement = createPermissionMiddleware({
  anyPermissions: [
    { resource: 'order', action: 'create' },
    { resource: 'order', action: 'update' },
  ],
  showErrorPage: true,
})

// 需要用户管理权限
export const requireUserManagement = createPermissionMiddleware({
  allPermissions: [
    { resource: 'user', action: 'read' },
    { resource: 'user', action: 'update' },
  ],
  showErrorPage: true,
})

export default createPermissionMiddleware