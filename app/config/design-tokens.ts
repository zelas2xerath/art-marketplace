/**
 * Design Token Configuration
 * 设计令牌配置
 * 
 * This file contains the actual design token values used throughout the application.
 * These tokens are integrated with Tailwind CSS and provide a consistent design system.
 */

// 颜色令牌配置
export const colorTokens = {
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',  // 主色调
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',  // 主色调
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  
  neutral: {
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    black: '#000000',
  },
  
  roles: {
    client: '#3b82f6',    // 蓝色 - 客户端主题色
    artist: '#8b5cf6',    // 紫色 - 画师端主题色
    admin: '#ef4444',     // 红色 - 管理端主题色
  },

  // 透明度系统
  opacity: {
    0: '0',
    5: '0.05',
    10: '0.1',
    15: '0.15',
    20: '0.2',
    25: '0.25',
    30: '0.3',
    40: '0.4',
    50: '0.5',
    60: '0.6',
    70: '0.7',
    75: '0.75',
    80: '0.8',
    85: '0.85',
    90: '0.9',
    95: '0.95',
    100: '1',
  },

  // 背景透明度预设
  backgrounds: {
    overlay: {
      light: 'rgba(0, 0, 0, 0.5)',
      medium: 'rgba(0, 0, 0, 0.7)',
      heavy: 'rgba(0, 0, 0, 0.8)',
    },
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      heavy: 'rgba(255, 255, 255, 0.3)',
    },
    surface: {
      light: 'rgba(255, 255, 255, 0.8)',
      medium: 'rgba(255, 255, 255, 0.9)',
      heavy: 'rgba(255, 255, 255, 0.95)',
    },
  },
}

// 间距令牌配置
export const spacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
}

// 字体令牌配置
export const typographyTokens = {
  fontFamily: {
    sans: [
      'Inter var',
      'Inter',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'Noto Sans',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Noto Color Emoji',
    ],
    serif: [
      'ui-serif',
      'Georgia',
      'Cambria',
      'Times New Roman',
      'Times',
      'serif',
    ],
    mono: [
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Monaco',
      'Consolas',
      'Liberation Mono',
      'Courier New',
      'monospace',
    ],
  },
  
  fontSize: {
    xs: ['12px', '16px'] as [string, string],
    sm: ['14px', '20px'] as [string, string],
    base: ['16px', '24px'] as [string, string],
    lg: ['18px', '28px'] as [string, string],
    xl: ['20px', '28px'] as [string, string],
    '2xl': ['24px', '32px'] as [string, string],
    '3xl': ['30px', '36px'] as [string, string],
    '4xl': ['36px', '40px'] as [string, string],
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

// 响应式断点配置
export const breakpointTokens = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// 阴影令牌配置
export const shadowTokens = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
}

// 圆角令牌配置
export const borderRadiusTokens = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  '3xl': '24px',
  full: '9999px',
}

// 动画令牌配置
export const animationTokens = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

// 完整设计令牌导出
export const designTokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  breakpoints: breakpointTokens,
  shadows: shadowTokens,
  borderRadius: borderRadiusTokens,
  animation: animationTokens,
}

// 透明度工具函数
export const withOpacity = (color: string, opacity: number | string): string => {
  const opacityValue = typeof opacity === 'string' ? parseFloat(colorTokens.opacity[opacity as unknown as keyof typeof colorTokens.opacity] || '1') : opacity
  return `${color}${Math.round(opacityValue * 255).toString(16).padStart(2, '0')}`
}

// 玻璃态效果预设
export const glassEffects = {
  light: {
    background: colorTokens.backgrounds.glass.light,
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  medium: {
    background: colorTokens.backgrounds.glass.medium,
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  heavy: {
    background: colorTokens.backgrounds.glass.heavy,
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
  },
}

// 响应式配置
export const responsiveConfig = {
  breakpoints: breakpointTokens,
  containerMaxWidths: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  gridColumns: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
}

// 默认导出设计令牌
export default designTokens