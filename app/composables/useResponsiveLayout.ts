/**
 * useResponsiveLayout Composable
 * 响应式布局组合式函数
 * 
 * Provides reactive breakpoint detection and layout utilities
 * for building responsive interfaces.
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  responsiveConfig, 
  layoutSystem,
  getCurrentBreakpoint,
  matchesBreakpoint,
  getGridColumns,
  getContainerMaxWidth,
  type ResponsiveBreakpoints,
  type ContainerWidth,
  containerWidths
} from '~/config/responsive-config'

export function useResponsiveLayout() {
  // Reactive state
  const currentBreakpoint = ref<keyof ResponsiveBreakpoints>('md')
  const screenWidth = ref(0)
  const screenHeight = ref(0)

  // Update screen dimensions and breakpoint
  const updateScreenSize = () => {
    if (typeof window !== 'undefined') {
      screenWidth.value = window.innerWidth
      screenHeight.value = window.innerHeight
      currentBreakpoint.value = getCurrentBreakpoint()
    }
  }

  // Computed breakpoint checks
  const isXs = computed(() => currentBreakpoint.value === 'xs')
  const isSm = computed(() => currentBreakpoint.value === 'sm')
  const isMd = computed(() => currentBreakpoint.value === 'md')
  const isLg = computed(() => currentBreakpoint.value === 'lg')
  const isXl = computed(() => currentBreakpoint.value === 'xl')
  const is2Xl = computed(() => currentBreakpoint.value === '2xl')

  // Computed breakpoint ranges
  const isMobile = computed(() => isXs.value || isSm.value)
  const isTablet = computed(() => isMd.value)
  const isDesktop = computed(() => isLg.value || isXl.value || is2Xl.value)

  // Computed layout properties
  const gridColumns = computed(() => getGridColumns(currentBreakpoint.value))
  const containerMaxWidth = computed(() => getContainerMaxWidth(currentBreakpoint.value))

  // Layout template utilities
  const getLayoutTemplate = (templateName: keyof typeof layoutSystem.templates) => {
    return layoutSystem.templates[templateName]
  }

  // Container width utilities
  const getContainerClasses = (width: ContainerWidth = 'container') => {
    return containerWidths[width]
  }

  // Responsive class generation
  const generateResponsiveClasses = (
    baseClass: string,
    breakpoints: Partial<Record<keyof ResponsiveBreakpoints, string>>
  ): string[] => {
    const classes = [baseClass]
    
    Object.entries(breakpoints).forEach(([breakpoint, modifier]) => {
      if (modifier) {
        classes.push(`${breakpoint}:${baseClass}-${modifier}`)
      }
    })
    
    return classes
  }

  // Responsive grid utilities
  const getResponsiveGridClasses = (
    columns: Partial<Record<keyof ResponsiveBreakpoints, number>>
  ): string[] => {
    const classes: string[] = []
    
    Object.entries(columns).forEach(([breakpoint, cols]) => {
      if (cols) {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`
        classes.push(`${prefix}grid-cols-${cols}`)
      }
    })
    
    return classes
  }

  // Responsive spacing utilities
  const getResponsiveSpacing = (
    property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr',
    spacing: Partial<Record<keyof ResponsiveBreakpoints, keyof typeof responsiveConfig.spacing>>
  ): string[] => {
    const classes: string[] = []
    
    Object.entries(spacing).forEach(([breakpoint, space]) => {
      if (space) {
        const prefix = breakpoint === 'xs' ? '' : `${breakpoint}:`
        const spaceValue = responsiveConfig.spacing[space]
        const spaceClass = getSpacingClass(property, spaceValue)
        classes.push(`${prefix}${spaceClass}`)
      }
    })
    
    return classes
  }

  // Helper function to convert spacing value to Tailwind class
  const getSpacingClass = (property: string, value: string): string => {
    const spacingMap: Record<string, string> = {
      '4px': '1',
      '8px': '2',
      '16px': '4',
      '24px': '6',
      '32px': '8',
      '48px': '12',
      '64px': '16',
      '96px': '24'
    }
    
    const spacingValue = spacingMap[value] || '4'
    return `${property}-${spacingValue}`
  }

  // Sidebar utilities for dashboard layouts
  const getSidebarClasses = (collapsed: boolean = false) => {
    return [
      'dashboard-sidebar',
      collapsed ? 'dashboard-sidebar-collapsed' : 'dashboard-sidebar-expanded',
      isMobile.value ? 'dashboard-sidebar-mobile' : 'dashboard-sidebar-desktop'
    ]
  }

  // Content area utilities
  const getContentClasses = (hasSidebar: boolean = false, sidebarCollapsed: boolean = false) => {
    const classes = ['dashboard-content']
    
    if (hasSidebar && !isMobile.value) {
      classes.push(sidebarCollapsed ? 'dashboard-content-sidebar-collapsed' : 'dashboard-content-sidebar-expanded')
    }
    
    return classes
  }

  // Responsive image utilities
  const getResponsiveImageClasses = (
    aspectRatio: 'square' | 'video' | 'photo' | 'wide' = 'photo'
  ): string[] => {
    const aspectRatios = {
      square: 'aspect-square',
      video: 'aspect-video',
      photo: 'aspect-[4/3]',
      wide: 'aspect-[16/9]'
    }
    
    return [
      'w-full',
      'object-cover',
      aspectRatios[aspectRatio],
      isMobile.value ? 'rounded-lg' : 'rounded-xl'
    ]
  }

  // Card grid utilities
  const getCardGridClasses = (
    cardType: 'artwork' | 'artist' | 'product' = 'artwork'
  ): string[] => {
    const gridConfigs = {
      artwork: {
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 4,
        '2xl': 5
      },
      artist: {
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        '2xl': 4
      },
      product: {
        xs: 2,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
        '2xl': 6
      }
    }
    
    return getResponsiveGridClasses(gridConfigs[cardType])
  }

  // Lifecycle hooks
  onMounted(() => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateScreenSize)
    }
  })

  return {
    // Reactive state
    currentBreakpoint: readonly(currentBreakpoint),
    screenWidth: readonly(screenWidth),
    screenHeight: readonly(screenHeight),
    
    // Breakpoint checks
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2Xl,
    isMobile,
    isTablet,
    isDesktop,
    
    // Layout properties
    gridColumns,
    containerMaxWidth,
    
    // Utility functions
    getLayoutTemplate,
    getContainerClasses,
    generateResponsiveClasses,
    getResponsiveGridClasses,
    getResponsiveSpacing,
    getSidebarClasses,
    getContentClasses,
    getResponsiveImageClasses,
    getCardGridClasses,
    
    // Manual update function
    updateScreenSize,
    
    // Configuration access
    responsiveConfig,
    layoutSystem
  }
}

/**
 * Breakpoint-specific composable
 * 断点特定的组合式函数
 */
export function useBreakpoint(breakpoint: keyof ResponsiveBreakpoints) {
  const matches = ref(false)
  
  const updateMatch = () => {
    matches.value = matchesBreakpoint(breakpoint)
  }
  
  onMounted(() => {
    updateMatch()
    window.addEventListener('resize', updateMatch)
  })
  
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateMatch)
    }
  })
  
  return {
    matches: readonly(matches)
  }
}

/**
 * Container width composable
 * 容器宽度组合式函数
 */
export function useContainer(width: ContainerWidth = 'container') {
  const containerClasses = computed(() => containerWidths[width])
  
  return {
    containerClasses,
    containerWidths
  }
}