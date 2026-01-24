/**
 * Design Tokens Composable
 * 设计令牌组合式函数
 * 
 * This composable provides reactive access to design tokens and utility functions
 * for Vue components.
 */

import { computed, type ComputedRef } from 'vue'
import { designTokens } from '~/config/design-tokens'
import type { UserRole, ComponentSize, ComponentVariant, ComponentState } from '~/types/design-tokens'
import {
  getRoleColor,
  getSizeClasses,
  getButtonVariantClasses,
  getInputStateClasses,
  getResponsiveGridClasses,
  getShadowClass,
  getBorderRadiusClass,
  getSpacingClass,
  mergeClasses,
  conditionalClasses,
  getAnimationDuration,
  getAnimationEasing,
} from '~/utils/design-tokens'

export function useDesignTokens() {
  // 响应式设计令牌
  const tokens = computed(() => designTokens)
  
  // 颜色相关
  const colors = computed(() => tokens.value.colors)
  const primaryColors = computed(() => colors.value.primary)
  const secondaryColors = computed(() => colors.value.secondary)
  const semanticColors = computed(() => colors.value.semantic)
  const neutralColors = computed(() => colors.value.neutral)
  const roleColors = computed(() => colors.value.roles)
  
  // 间距相关
  const spacing = computed(() => tokens.value.spacing)
  
  // 字体相关
  const typography = computed(() => tokens.value.typography)
  const fontFamily = computed(() => typography.value.fontFamily)
  const fontSize = computed(() => typography.value.fontSize)
  const fontWeight = computed(() => typography.value.fontWeight)
  
  // 断点相关
  const breakpoints = computed(() => tokens.value.breakpoints)
  
  // 阴影相关
  const shadows = computed(() => tokens.value.shadows)
  
  // 圆角相关
  const borderRadius = computed(() => tokens.value.borderRadius)
  
  // 动画相关
  const animation = computed(() => tokens.value.animation)
  
  // 工具函数
  const utils = {
    getRoleColor,
    getSizeClasses,
    getButtonVariantClasses,
    getInputStateClasses,
    getResponsiveGridClasses,
    getShadowClass,
    getBorderRadiusClass,
    getSpacingClass,
    mergeClasses,
    conditionalClasses,
    getAnimationDuration,
    getAnimationEasing,
  }
  
  // 创建响应式样式类生成器
  function createButtonClasses(
    variant: ComputedRef<ComponentVariant> | ComponentVariant,
    size: ComputedRef<ComponentSize> | ComponentSize,
    role?: ComputedRef<UserRole> | UserRole,
    disabled?: ComputedRef<boolean> | boolean
  ) {
    return computed(() => {
      const variantValue = typeof variant === 'object' ? variant.value : variant
      const sizeValue = typeof size === 'object' ? size.value : size
      const roleValue = typeof role === 'object' ? role?.value : role
      const disabledValue = typeof disabled === 'object' ? disabled?.value : disabled
      
      const variantClasses = getButtonVariantClasses(variantValue, roleValue)
      const sizeClasses = getSizeClasses(sizeValue)
      const disabledClasses = disabledValue ? 'opacity-50 cursor-not-allowed' : ''
      
      return mergeClasses(
        variantClasses,
        sizeClasses.padding,
        sizeClasses.fontSize,
        disabledClasses
      )
    })
  }
  
  function createInputClasses(
    state: ComputedRef<ComponentState> | ComponentState,
    size: ComputedRef<ComponentSize> | ComponentSize,
    error?: ComputedRef<boolean> | boolean
  ) {
    return computed(() => {
      const stateValue = typeof state === 'object' ? state.value : state
      const sizeValue = typeof size === 'object' ? size.value : size
      const errorValue = typeof error === 'object' ? error?.value : error
      
      const stateClasses = getInputStateClasses(stateValue)
      const sizeClasses = getSizeClasses(sizeValue)
      const errorClasses = errorValue ? 'border-error focus:ring-red-500' : ''
      
      return mergeClasses(
        stateClasses,
        sizeClasses.padding,
        sizeClasses.fontSize,
        errorClasses
      )
    })
  }
  
  function createCardClasses(
    interactive?: ComputedRef<boolean> | boolean,
    shadow?: ComputedRef<keyof typeof designTokens.shadows> | keyof typeof designTokens.shadows,
    radius?: ComputedRef<keyof typeof designTokens.borderRadius> | keyof typeof designTokens.borderRadius
  ) {
    return computed(() => {
      const interactiveValue = typeof interactive === 'object' ? interactive?.value : interactive
      const shadowValue = typeof shadow === 'object' ? shadow?.value : shadow
      const radiusValue = typeof radius === 'object' ? radius?.value : radius
      
      const baseClasses = 'bg-white border border-gray-100'
      const interactiveClasses = interactiveValue 
        ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer'
        : 'transition-shadow duration-300'
      const shadowClasses = getShadowClass(shadowValue || 'sm')
      const radiusClasses = getBorderRadiusClass(radiusValue || 'xl')
      
      return mergeClasses(
        baseClasses,
        interactiveClasses,
        shadowClasses,
        radiusClasses
      )
    })
  }
  
  // 响应式断点检测
  function useBreakpoint() {
    const { width } = useWindowSize()
    
    const isXs = computed(() => width.value >= parseInt(breakpoints.value.xs))
    const isSm = computed(() => width.value >= parseInt(breakpoints.value.sm))
    const isMd = computed(() => width.value >= parseInt(breakpoints.value.md))
    const isLg = computed(() => width.value >= parseInt(breakpoints.value.lg))
    const isXl = computed(() => width.value >= parseInt(breakpoints.value.xl))
    const is2xl = computed(() => width.value >= parseInt(breakpoints.value['2xl']))
    
    const currentBreakpoint = computed(() => {
      if (is2xl.value) return '2xl'
      if (isXl.value) return 'xl'
      if (isLg.value) return 'lg'
      if (isMd.value) return 'md'
      if (isSm.value) return 'sm'
      return 'xs'
    })
    
    return {
      isXs,
      isSm,
      isMd,
      isLg,
      isXl,
      is2xl,
      currentBreakpoint,
      width,
    }
  }
  
  // 主题切换功能
  function useTheme() {
    const currentTheme = ref<'light' | 'dark'>('light')
    
    const toggleTheme = () => {
      currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
      // 这里可以添加实际的主题切换逻辑
      document.documentElement.classList.toggle('dark', currentTheme.value === 'dark')
    }
    
    const setTheme = (theme: 'light' | 'dark') => {
      currentTheme.value = theme
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
    
    return {
      currentTheme: readonly(currentTheme),
      toggleTheme,
      setTheme,
    }
  }
  
  return {
    // 设计令牌
    tokens,
    colors,
    primaryColors,
    secondaryColors,
    semanticColors,
    neutralColors,
    roleColors,
    spacing,
    typography,
    fontFamily,
    fontSize,
    fontWeight,
    breakpoints,
    shadows,
    borderRadius,
    animation,
    
    // 工具函数
    utils,
    
    // 样式类生成器
    createButtonClasses,
    createInputClasses,
    createCardClasses,
    
    // 响应式功能
    useBreakpoint,
    useTheme,
  }
}

// 窗口尺寸检测（简化版，实际项目中可能需要使用 @vueuse/core）
function useWindowSize() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const height = ref(typeof window !== 'undefined' ? window.innerHeight : 768)
  
  if (typeof window !== 'undefined') {
    const updateSize = () => {
      width.value = window.innerWidth
      height.value = window.innerHeight
    }
    
    window.addEventListener('resize', updateSize)
    
    onUnmounted(() => {
      window.removeEventListener('resize', updateSize)
    })
  }
  
  return { width, height }
}