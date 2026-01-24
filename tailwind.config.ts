import { designTokens } from './app/config/design-tokens'

export default {
    content: [
        './app/components/**/*.{vue,js,ts}',
        './app/pages/**/*.{vue,js,ts}',
        './app/layouts/**/*.{vue,js,ts}',
        './app/app.vue',
        './components/**/*.{vue,js,ts}',
        './pages/**/*.{vue,js,ts}',
        './layouts/**/*.{vue,js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            // 颜色系统
            colors: {
                primary: designTokens.colors.primary,
                secondary: designTokens.colors.secondary,
                gray: designTokens.colors.neutral.gray,
                success: designTokens.colors.semantic.success,
                warning: designTokens.colors.semantic.warning,
                error: designTokens.colors.semantic.error,
                info: designTokens.colors.semantic.info,
                // 角色专属颜色
                'role-client': designTokens.colors.roles.client,
                'role-artist': designTokens.colors.roles.artist,
                'role-admin': designTokens.colors.roles.admin,
            },
            
            // 字体系统
            fontFamily: designTokens.typography.fontFamily,
            fontSize: designTokens.typography.fontSize,
            fontWeight: designTokens.typography.fontWeight,
            
            // 间距系统
            spacing: designTokens.spacing,
            
            // 阴影系统
            boxShadow: designTokens.shadows,
            
            // 圆角系统
            borderRadius: designTokens.borderRadius,
            
            // 动画系统
            transitionDuration: designTokens.animation.duration,
            transitionTimingFunction: designTokens.animation.easing,
            
            // 响应式断点
            screens: designTokens.breakpoints,
        },
    },
    plugins: [],
}
